import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct,
    cart: [],
    modalIsOpen: false,
    modalProduct: detailProduct,
    cartSubtotal: 0,
    cartTax: 0,
    cartTotal: 0,
  };
  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let products = [];
    storeProducts.forEach(currentItem => {
      const item = { ...currentItem };
      products = [...products, item];
    });
    this.setState({ products });
  };

  getItem = id => this.state.products.find(item => item.id === id);

  handleDetail = id => {
    const product = this.getItem(id);
    this.setState({ detailProduct: product });
  };

  addToCart = id => {
    let products = [...this.state.products];
    const index = products.indexOf(this.getItem(id));
    const product = products[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState({ products, cart: [...this.state.cart, product] }, () => {
      this.handleTotals();
    });
  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState({ modalProduct: product, modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  increment = id => {
    let cart = [...this.state.cart];
    const selectedProduct = cart.find(item => item.id === id);
    const index = cart.indexOf(selectedProduct);
    const product = cart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState({ cart: [...cart] }, () => {
      this.handleTotals();
    });
  };

  decrement = id => {
    let cart = [...this.state.cart];
    const selectedProduct = cart.find(item => item.id === id);
    const index = cart.indexOf(selectedProduct);
    const product = cart[index];
    product.count = product.count === 0 ? 0 : product.count - 1;
    product.total = product.count * product.price;
    this.setState({ cart: [...cart] }, () => {
      this.handleTotals();
    });
  };

  removeItem = id => {
    let products = [...this.state.products];
    let cart = [...this.state.cart];
    cart = cart.filter(item => item.id !== id);
    const index = products.indexOf(this.getItem(id));
    const removedProduct = products[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    this.setState({ cart: [...cart], products: [...products] }, () => {
      this.handleTotals();
    });
  };

  clearCart = () => {
    this.setState({ cart: [] }, () => {
      this.setProducts();
      this.handleTotals();
    });
  };

  handleTotals = () => {
    let cartSubtotal = 0;
    this.state.cart.map(item => (cartSubtotal += item.total));
    const cartTax = parseFloat((cartSubtotal * 0.1).toFixed(2));
    this.setState({ cartSubtotal, cartTax, cartTotal: cartTax + cartSubtotal });
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
