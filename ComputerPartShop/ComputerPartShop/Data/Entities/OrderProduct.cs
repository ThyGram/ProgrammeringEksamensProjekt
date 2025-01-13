namespace ComputerPartShop.Data.Entities
{
    public class OrderProduct
    {
        public int Id { get; set; }
        public Order Order { get; set; }
        public PartProduct PartProduct { get; set; }
        public int Quantity { get; set; }
    }
}
