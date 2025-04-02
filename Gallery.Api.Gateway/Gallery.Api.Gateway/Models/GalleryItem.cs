using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Gallery.Api.Gateway.Models
{
    public class GalleryItem
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public int PageId { get; set; }
        public int Index { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public string BarCode { get; set; }
        public string ImageExt { get; set; }
        public string SubTitle { get; set; }
        public string Stock { get; set; }

        [BsonGuidRepresentation(GuidRepresentation.Standard)]
        public Guid ImageId { get; set; }
    }
}