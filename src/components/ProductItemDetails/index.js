// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    specificProductDetails: {},
    similarProductDetails: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getSpecificProductDetails()
  }

  getUpadtedProductData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
  })

  getSpecificProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const responseData = await response.json()

      const upadtedSpecificProductData =
        this.getUpadtedProductData(responseData)
      const upadtedSimilarProductData = responseData.similar_products.map(
        eachProduct => this.getUpadtedProductData(eachProduct),
      )

      this.setState({
        apiStatus: apiStatusConstants.success,
        specificProductDetails: upadtedSpecificProductData,
        similarProductDetails: upadtedSimilarProductData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickMinusBtn = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onClickPlusBtn = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderSpecificProductDetailsView = () => {
    const {specificProductDetails, similarProductDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = specificProductDetails

    return (
      <div className="all-products-container">
        <div className="specific-product-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="product-details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="product-rating">{rating}</p>
                <img
                  className="star-icon"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="product-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="produt-description">{description}</p>
            <p className="product-availability">
              <span className="highlight">Available:</span> {availability}
            </p>
            <p className="product-brand">
              <span className="highlight">Brand:</span> {brand}
            </p>
            <hr className="line" />
            <div className="quantity-btn-container">
              <button
                className="quantity-btn"
                type="button"
                onClick={this.onClickMinusBtn}
                data-testid="minus"
              >
                <BsDashSquare className="icons" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                className="quantity-btn"
                type="button"
                onClick={this.onClickPlusBtn}
                data-testid="plus"
              >
                <BsPlusSquare className="icons" />
              </button>
            </div>
            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>

        <div className="similar-products-container">
          <h1 className="similar-product-heading">Similar Products</h1>
          <ul className="similar-product-list">
            {similarProductDetails.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                similarProductDetails={eachProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-shopping-btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSpecificProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSpecificProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-dtails-container">
          {this.renderSpecificProductDetails()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
