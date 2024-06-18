import { useState } from 'react';

const Checkout = () => {
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [product, setProduct] = useState({ id: '', name: '', price: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer, product }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Customer Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Customer Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Product ID</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={product.id}
            onChange={(e) => setProduct({ ...product, id: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Product Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Product Price</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Checkout;
