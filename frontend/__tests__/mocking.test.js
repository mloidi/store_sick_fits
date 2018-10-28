function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}
Person.prototype.fechFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.foods), 2000);
  });
};

describe('mocking learnig', () => {
  it('works a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('snickers');
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('snickers');
    fetchDogs('hugo');
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it('can create a person', () => {
    const me = new Person('Mikel', ['pizza', 'burgs']);
    expect(me.name).toBe('Mikel');
  });

  it('can fech foods', async () => {
    const me = new Person('Mikel', ['pizza', 'burgs']);
    me.fechFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen']);
    const favFoods = await me.fechFavFoods();
    expect(favFoods).toContain('ramen');
  });
});
