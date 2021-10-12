using MongoDB.Bson.Serialization.Attributes;

namespace Gallery.Api.Gateway.Models
{
    public class Properties
    {
        [BsonId]
        public int Id { get; set; }
        public BgColors BgColors { get; set; }
        public bool AskBeforeItemRemoval { get; set; }
    }
}