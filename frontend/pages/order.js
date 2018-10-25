import PleaseSign from '../components/PleaseSign';
import Order from '../components/Order';

const OrderPage = ({ query }) => (
  <div>
    <PleaseSign>
      <Order id={query.id}></Order>
    </PleaseSign>
  </div>
);

export default OrderPage;
