import { Greeter } from '../src/index';

test("My Greeter", ()=> {
    expect(Greeter("Dammy")).toBe("Hello Dammy")
})