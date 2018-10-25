import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends React.Component {
  onToken = async (response, createOrder) => {
    NProgress.start();
    const order = await createOrder({
      variables: {
        token: response.id
      }
    }).catch(error => {
      alert(err.message);
    });
    Router.push({
      pathname: './order',
      query: { id: order.data.createOrder.id }
    });
    console.log(order);
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                name="Mikel tutorial"
                amount={calcTotalPrice(me.cart)}
                description={`Order of ${totalItems(me.cart)} items!`}
                image={
                  me.cart.lenght && me.cart[0].image && me.cart[0].item.image
                }
                stripeKey="pk_test_a0lxMkMwG2X7MmdjQsJhL5mj"
                currency="USD"
                email={me.email}
                token={response => this.onToken(response, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
