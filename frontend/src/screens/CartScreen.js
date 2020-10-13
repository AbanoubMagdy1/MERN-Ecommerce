import React ,{ useEffect}from 'react'
import {Row, Col, Image, Form, Card, Button, ListGroup} from 'react-bootstrap'
import {cartAdd, cartRemove} from '../actions/productActions'
import {useDispatch, useSelector} from 'react-redux'

const CartScreen = ({match, location}) => {
    const qty = parseInt(location.search.slice(location.search.indexOf("=")+1))
    const cartItems = useSelector(state => state.cart.cartItems)
    const totalItems = cartItems.length ? cartItems.reduce((acc, cur) => acc + cur.qty ,0) : 0;
    const totalPrice = cartItems.length ? cartItems.reduce((acc, cur) => acc + cur.qty * cur.price ,0) : 0;
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(cartAdd(match.params.id, qty))
    },[])
    console.log(cartItems)
    return (
        <>
            <h1 className="my-3">SHOPPING CART</h1>
            <Row>
                <Col md={8}>
                    {cartItems.map(item => (
                        <Row key={item.id} className="my-2">
                            <Col md={2}>
                                <Image src={item.image} alt={item.name} fluid/>
                            </Col>
                            <Col md={3}>
                                {item.name}
                            </Col>
                            <Col md={2}>
                                ${item.price}
                            </Col>
                            <Col md={2}>
                                <Form.Control 
                                    as="select"
                                    onChange={({target}) => {
                                        dispatch(cartAdd(item.id, parseInt(target.value)))
                                    }}
                                    value={item.qty}
                                >
                                    {[...Array(item.count).keys()].map(val => (
                                        <option value={val+1} key={val+1}>{val + 1}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col md={2}>
                                <Button 
                                    className="btn btn-light"
                                    onClick={() => dispatch(cartRemove(item.id))}
                                >
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </Col>

                        </Row>
                    ))}
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>Subtotal ({totalItems}) items</h3>
                                <p>${totalPrice.toFixed(2)}</p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button 
                                    className="btn btn-block"
                                    disabled={!totalItems}   
                                >
                                    Proceed to checkout</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CartScreen
