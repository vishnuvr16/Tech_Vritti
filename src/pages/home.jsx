import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Zap 
} from 'lucide-react';

const Homepage = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Laptop', category: 'Electronics', quantity: 23, price: 1999.99, sku: 'QNTM-001' },
    { id: 2, name: 'Realme Smartphone', category: 'Electronics', quantity: 13, price: 1299.99, sku: 'AIPH-002' },
    { id: 3, name: 'Ergonomic SmartChair', category: 'Furniture', quantity: 8, price: 799.99, sku: 'ERGO-003' },
    { id: 4, name: 'Monitor', category: 'Electronics', quantity: 15, price: 599.99, sku: 'MNTR-004' },
    { id: 5, name: 'Modular Bookshelf', category: 'Furniture', quantity: 6, price: 449.99, sku: 'MDLR-005' }
  ]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add',
    currentItem: null
  });

  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'quantity', direction: 'ascending' });

  const filteredInventory = useMemo(() => {
    let result = [...inventory];

    // filtering
    if (filter) {
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Sorting logic
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [inventory, filter, sortConfig]);

  const openModal = (mode, item = null) => {
    setModalState({
      isOpen: true,
      mode,
      currentItem: item
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add', currentItem: null });
  };

  const handleSaveItem = (newItem) => {
    if (modalState.mode === 'add') {
      setInventory([...inventory, { ...newItem, id: Date.now() }]);
    } else {
      setInventory(inventory.map(item => 
        item.id === modalState.currentItem.id ? newItem : item
      ));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-8xl mx-auto bg-slate-800 rounded-2xl shadow-2xl border border-slate-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <Layers className="text-cyan-400" size={32} />
            <h1 className="text-3xl font-bold text-cyan-300">Inventory Management</h1>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search inventory..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
            <button 
              onClick={() => openModal('add')}
              className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-full flex items-center space-x-2 transition"
            >
              <PlusCircle size={20} />
              <span>Add Item</span>
            </button>
          </div>
        </div>
        {/* <hr className='p-1'/> */}

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                {['name', 'category', 'quantity', 'price', 'sku'].map(key => (
                  <th 
                    key={key} 
                    onClick={() => setSortConfig({ 
                      key, 
                      direction: sortConfig.key === key && sortConfig.direction === 'ascending' 
                        ? 'descending' 
                        : 'ascending' 
                    })}
                    className="p-4 text-left uppercase text-sm text-slate-400 cursor-pointer hover:bg-slate-600 transition"
                  >
                    <div className="flex items-center">
                      {key}
                      {sortConfig.key === key && (
                        sortConfig.direction === 'ascending' 
                          ? <ArrowUp size={16} className="ml-2" /> 
                          : <ArrowDown size={16} className="ml-2" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredInventory.map(item => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className={`
                      border-b border-slate-700 
                      ${item.quantity < 10 ? 'bg-red-900/20 hover:bg-red-900/30' : 'hover:bg-slate-700'}
                      transition duration-300
                    `}
                  >
                    {['name', 'category', 'quantity', 'price', 'sku'].map(key => (
                      <td 
                        key={key} 
                        className={`
                          p-4 
                          ${key === 'quantity' && item.quantity < 5 ? 'text-red-400 font-bold' : 'text-white'}
                          ${key === 'price' ? 'text-green-400' : ''}
                        `}
                      >
                        {key === 'price' ? `$${item[key].toFixed(2)}` : item[key]}
                      </td>
                    ))}
                    <td className="p-4 text-right space-x-3">
                      <button 
                        onClick={() => openModal('edit', item)}
                        className="text-cyan-400 hover:text-cyan-300 transition"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

   
      {modalState.isOpen && (
        <ItemModal 
          mode={modalState.mode}
          item={modalState.currentItem}
          onSave={handleSaveItem}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

const ItemModal = ({ mode, item, onSave, onClose }) => {
    const [formData, setFormData] = useState(item || {
      name: '', 
      category: '', 
      quantity: 0, 
      price: 0, 
      sku: ''
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Ensure price and quantity are converted to numbers
      const processedData = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price)
      };
  
      onSave(processedData);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };
  
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700"
        >
          <h2 className="text-2xl mb-6 text-cyan-300">
            {mode === 'add' ? 'Add New Item' : 'Edit Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              min="0"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              min="0"
              step="0.01"
            />
            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-cyan-500 text-black rounded-full hover:bg-cyan-600 transition"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

export default Homepage;