import ItemComponent from '../components/Item';
import { shallow, mount } from 'enzyme';
import formatMoney from '../lib/formatMoney';
import toJSON from 'enzyme-to-json';

const fakeItem = {
  id: 'AQW1234',
  title: 'My item',
  price: 2000,
  description: 'My description',
  image: 'picture.png',
  largeImage: 'largePicture.png'
};

describe('<Item/>', () => {
  it('renders and matches the sanpshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  // it('renders the image properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const img = wrapper.find('img');
  //   expect(img.props().src).toBe(fakeItem.image);
  //   expect(img.props().alt).toBe(fakeItem.title);
  // });

  // it('renders an displays properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const PriceTag = wrapper.find('PriceTag');
  //   expect(PriceTag.dive().text()).toBe(formatMoney(fakeItem.price));
  //   expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  // });
  // it('renders out the buttons properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const buttonList = wrapper.find('.buttonList');
  //   console.log(buttonList.debug());
  //   expect(buttonList.children()).toHaveLength(3);
  //   expect(buttonList.find('Link')).toHaveLength(1);
  //   expect(buttonList.find('Link')).toBeTruthy;
  //   expect(buttonList.find('AddToCart').exists()).toBe(true);
  //   expect(buttonList.find('DeleteItem').exists()).toBe(true);
  // });
});
