using Gallery.Api.Gateway.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Gallery.Api.Gateway.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ImagesController : ControllerBase
    {
        private readonly ILogger<ItemsController> logger;
        private readonly IConfiguration configuration;

        public ImagesController(ILogger<ItemsController> logger, IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        [HttpPost]
        public async Task UploadImage([FromForm] IFormFile file)
        {
            try
            {
                if (file.Length > 0)
                {
                    string[] splittedFile = file.FileName.Split('.');

                    if(splittedFile.Length != 2)
                    {
                        throw new BadHttpRequestException("Wrong file name");
                    }

                    Directory.CreateDirectory("Media");

                    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Media", $"{new Guid(splittedFile[0])}.{splittedFile[1]}");
                    using Stream fileStream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(fileStream);
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed uploading the requested image..");
                throw;
            }
        }

        [HttpPost]
        public async Task ChangeImage([FromForm] IFormFile file)
        {
            try
            {
                if (file.Length > 0)
                {
                    string[] splittedFile = file.FileName.Split('.');

                    if(splittedFile.Length != 2)
                    {
                        throw new BadHttpRequestException("Wrong file name");
                    }

                    Directory.CreateDirectory("Media");

                    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Media", $"{splittedFile[0]}.{splittedFile[1]}");
                    using Stream fileStream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(fileStream);
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed uploading the requested image..");
                throw;
            }
        }
    }
}
