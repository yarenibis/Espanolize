using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

namespace api.src.Filters
{
    public class SwaggerFileOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var fileParams = context.MethodInfo.GetParameters()
                .Where(p => p.ParameterType == typeof(IFormFile) || 
                           p.ParameterType == typeof(IFormFile[]) || 
                           p.ParameterType == typeof(List<IFormFile>))
                .ToList();

            if (!fileParams.Any())
            {
                // DTO içindeki IFormFile'ları kontrol et
                var dtoParams = context.MethodInfo.GetParameters()
                    .Where(p => p.CustomAttributes.Any(attr => attr.AttributeType == typeof(FromFormAttribute)))
                    .Select(p => p.ParameterType)
                    .ToList();

                foreach (var dtoType in dtoParams)
                {
                    var properties = dtoType.GetProperties()
                        .Where(p => p.PropertyType == typeof(IFormFile) || 
                                   p.PropertyType == typeof(IFormFile[]) || 
                                   p.PropertyType == typeof(List<IFormFile>))
                        .ToList();

                    if (properties.Any())
                    {
                        fileParams.AddRange(properties.Select(p => 
                            (System.Reflection.ParameterInfo)new FakeParameterInfo(p.Name, p.PropertyType)));
                    }
                }
            }

            if (fileParams.Any())
            {
                operation.Parameters.Clear();

                var uploadFileMediaType = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = new Dictionary<string, OpenApiSchema>(),
                        Required = new HashSet<string>()
                    }
                };

                // Her bir file parametresi için schema oluştur
                foreach (var param in fileParams)
                {
                    var paramName = param.Name.ToLower();
                    
                    if (param.ParameterType == typeof(IFormFile) || 
                        param.ParameterType == typeof(IFormFile[]))
                    {
                        uploadFileMediaType.Schema.Properties[paramName] = new OpenApiSchema
                        {
                            Type = "string",
                            Format = "binary",
                            Description = "Upload file"
                        };
                    }
                    else if (param.ParameterType == typeof(List<IFormFile>))
                    {
                        uploadFileMediaType.Schema.Properties[paramName] = new OpenApiSchema
                        {
                            Type = "array",
                            Items = new OpenApiSchema
                            {
                                Type = "string",
                                Format = "binary"
                            },
                            Description = "Upload multiple files"
                        };
                    }

                    uploadFileMediaType.Schema.Required.Add(paramName);
                }

                // FormData'daki diğer parametreleri de ekle
                var otherParams = context.MethodInfo.GetParameters()
                    .Where(p => !fileParams.Contains(p) && 
                               p.GetCustomAttributes(typeof(FromFormAttribute), false).Any())
                    .ToList();

                foreach (var param in otherParams)
                {
                    var paramName = param.Name.ToLower();
                    var paramType = GetSwaggerType(param.ParameterType);
                    
                    uploadFileMediaType.Schema.Properties[paramName] = new OpenApiSchema
                    {
                        Type = paramType,
                        Description = param.Name
                    };
                }

                operation.RequestBody = new OpenApiRequestBody
                {
                    Content =
                    {
                        ["multipart/form-data"] = uploadFileMediaType
                    }
                };
            }
        }

        private string GetSwaggerType(Type type)
        {
            if (type == typeof(string)) return "string";
            if (type == typeof(int) || type == typeof(long)) return "integer";
            if (type == typeof(bool)) return "boolean";
            if (type == typeof(decimal) || type == typeof(double) || type == typeof(float)) return "number";
            if (type.IsEnum) return "string";
            return "string";
        }

        private class FakeParameterInfo : System.Reflection.ParameterInfo
        {
            private readonly string _name;
            private readonly Type _type;

            public FakeParameterInfo(string name, Type type)
            {
                _name = name;
                _type = type;
            }

            public override string Name => _name;
            public override Type ParameterType => _type;
        }
    }
}