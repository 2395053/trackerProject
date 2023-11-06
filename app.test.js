const checkUserDefinedCurrency = require('./app');
const checkNotificationType = require('./app');
const add2Numbers = require('./app');

test ('should return true for a non-empty array', ()=> {
    let userDefinedCurrencies = ['CAD'];
    const check = checkUserDefinedCurrency(userDefinedCurrencies);
    expect(check).toBeTruthy;
})
test ('should return false for a non-empty array', ()=> {
    let userDefinedCurrencies = [];
    const check = checkUserDefinedCurrency(userDefinedCurrencies);
    expect(check).toBeFalsy;
})

describe('checkNotificationType is working', () => {
    var type1 = "sms"
    var type2 = "email"
    test('check if it is sms', () => {
    const itsSMS = checkNotificationType(type1); 
      expect(itsSMS).toMatch("sms");
    }); 
    test('check if it is email', () => {
        const itIsEmail = checkNotificationType(type2);
        expect(itIsEmail).toMatch("email");
    });
  });
test('adding function', () => {
    const answer = add2Numbers(2,2)
    expect(answer).toBe(4)
})