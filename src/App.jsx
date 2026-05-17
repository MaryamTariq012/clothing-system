import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('shop');
  const [search, setSearch] = useState(""); // --- NEW: Search Module ---
  const [orders, setOrders] = useState([]); // --- NEW: Order History Module ---

  const API = 'http://localhost:5000/api/products';

  const getData = () => axios.get(`${API}/all`).then(res => setProducts(res.data));
  useEffect(() => { getData(); }, []);

  const getPic = (name) => {
    const n = name?.toLowerCase().trim() || "";
    if (n.includes('shirt')) return 'https://zed.com.pk/cdn/shop/files/050A7623.jpg?v=1715062868&w=500';
    if (n.includes('pant') || n.includes('jeans') || n.includes('trouser'))
      return 'https://pantproject.com/cdn/shop/files/DSC1113.jpg?v=1743609636&width=1080?w=500';
    if (n.includes('kurta') || n.includes('shalwar') || n.includes('kameez'))
      return 'https://almirah.com.pk/cdn/shop/files/1205_1.jpg?v=1757272837?w=500';
    if (n.includes('suit') || n.includes('coat') || n.includes('blazer'))
      return 'https://uomoattire.com/cdn/shop/files/ChatGPTImageMay6_2026_07_40_14PM.png?v=1778078602?w=500';
    if (n.includes('tshirt') || n.includes('t-shirt'))
      return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500';
    if (n.includes('shoe') || n.includes('sneaker') || n.includes('chappal'))
      return 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500';
    if (n.includes('watch')) return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500';
    if (n.includes('wallet') || n.includes('belt')) return 'https://images.unsplash.com/photo-1627123430985-71d464a0b89a?w=500';
    if (n.includes('hoodie') || n.includes('jacket') || n.includes('sweater'))
      return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500';
    return 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=500';
  };

  const deleteItem = (id) => {
    axios.delete(`${API}/delete/${id}`).then(() => {
      alert("Item Removed from Stock!");
      getData();
    });
  };

  // --- Logic for Placing Order ---
  const handleCheckout = () => {
    const total = cart.reduce((s, i) => s + i.price, 0);
    const newOrder = {
      items: cart,
      totalBill: total,
      date: new Date().toLocaleString()
    };
    setOrders([newOrder, ...orders]);
    alert(`Order Placed! Total Bill: Rs. ${total}`);
    setCart([]);
  };

  // --- Filter Products based on Search ---
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav style={{ background: '#1a1a1a', color: 'white', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h2 style={{ letterSpacing: '3px', margin: 0 }}>ELITE GENTS WEAR</h2>
        <div>
          <button onClick={() => setView('shop')} style={navBtn}>COLLECTION</button>
          <button onClick={() => setView('orders')} style={navBtn}>ORDERS ({orders.length})</button>
          <button onClick={() => setView('admin')} style={navBtn}>INVENTORY</button>
        </div>
      </nav>

      <div style={{ padding: '30px' }}>

        {/* VIEW 1: SHOPPING AREA */}
        {view === 'shop' && (
          <div>
            {/* Search Bar Module */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <input
                type="text"
                placeholder="Search style, brand or category..."
                style={searchInput}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '25px' }}>
              <div style={{ flex: 3 }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px' }}>
                    <h3>No items match your search.</h3>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                    {filteredProducts.map(p => (
                      <div key={p._id} style={cardStyle}>
                        <img src={getPic(p.name)} style={{ width: '100%', height: '300px', objectFit: 'cover' }} alt={p.name} />
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                          <h3 style={{ textTransform: 'uppercase', fontSize: '16px', marginBottom: '10px' }}>{p.name}</h3>
                          <h2 style={{ color: '#c0392b', margin: '0 0 15px 0' }}>Rs. {p.price}</h2>
                          <button onClick={() => setCart([...cart, p])} style={addBtn}>ADD TO BAG</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shopping Sidebar / Bill Module */}
              <div style={sidebar}>
                <h3 style={{ textAlign: 'center', marginTop: 0 }}>🛒 YOUR BAG ({cart.length})</h3>
                <hr style={{ border: '0.5px solid #eee' }} />
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                  {cart.length === 0 ? <p style={{ color: '#888', textAlign: 'center' }}>Bag is empty</p> :
                    cart.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                        <span>{item.name}</span>
                        <b>Rs.{item.price}</b>
                      </div>
                    ))
                  }
                </div>
                <div style={{ borderTop: '2px solid #1a1a1a', paddingTop: '15px' }}>
                  <h3 style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}>
                    <span>Total Bill:</span>
                    <span>Rs. {cart.reduce((s, i) => s + i.price, 0)}</span>
                  </h3>
                  <button
                    style={{ ...confirmBtn, opacity: cart.length === 0 ? 0.5 : 1 }}
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ORDERS HISTORY MODULE */}
        {view === 'orders' && (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>ORDER HISTORY</h2>
            {orders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>No orders placed yet.</p>
            ) : (
              orders.map((order, idx) => (
                <div key={idx} style={orderRow}>
                  <div>
                    <small style={{ color: '#888' }}>{order.date}</small>
                    <p style={{ margin: '5px 0' }}><b>Items:</b> {order.items.map(i => i.name).join(', ')}</p>
                  </div>
                  <h3 style={{ color: '#27ae60' }}>Rs. {order.totalBill}</h3>
                </div>
              ))
            )}
          </div>
        )}

        {/* VIEW 3: ADMIN AREA */}
        {view === 'admin' && (
          <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', marginBottom: '25px' }}>Stock Management</h2>
            {products.map(p => (
              <div key={p._id} style={listRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={getPic(p.name)} width="60" height="60" style={{ borderRadius: '5px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '18px' }}><b>{p.name}</b> <span style={{ color: '#888', marginLeft: '10px' }}>Rs.{p.price}</span></span>
                </div>
                <button onClick={() => deleteItem(p._id)} style={delBtn}>DELETE ITEM</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- CSS STYLES ---
const navBtn = { background: 'transparent', color: 'white', border: '1px solid white', padding: '8px 25px', marginLeft: '15px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', transition: '0.3s' };
const cardStyle = { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 6px 15px rgba(0,0,0,0.05)' };
const addBtn = { width: '100%', padding: '12px', background: '#1a1a1a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px' };
const delBtn = { background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const sidebar = { flex: 1, background: 'white', padding: '25px', borderRadius: '15px', height: 'fit-content', position: 'sticky', top: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const confirmBtn = { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px', borderRadius: '8px' };
const listRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #f5f5f5' };
const searchInput = { width: '50%', padding: '12px 20px', borderRadius: '25px', border: '1px solid #ccc', fontSize: '16px', outline: 'none' };
const orderRow = { background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };

export default App;