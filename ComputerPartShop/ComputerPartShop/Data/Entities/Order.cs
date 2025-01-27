 namespace ComputerPartShop.Data.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public Customer Customer {  get; set; }
        public DateTime CreatedDate { get; set; }
        public ICollection<OrderProduct> Items { get; set; } 

    }
}
