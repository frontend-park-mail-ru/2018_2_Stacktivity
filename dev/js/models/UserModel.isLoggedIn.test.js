import UserModel from "./UserModel";
import Emitter from "../modules/Emitter";
import AjaxModule from "../modules/Ajax";

jest.mock('../modules/Ajax');

describe('UserModel: isLoggedIn', () => {
    it('should emit done-check-user-login', async (done) => {
        const user = new UserModel(true);

        Emitter.on("done-check-user-login", done); // after event emit callback is called

        const resp = {
            json: Promise.resolve({}),
            status: 123,
        };

        AjaxModule.doGet.mockResolvedValueOnce(resp);
        await user.isLoggedIn();
    });

    it('should set _data.is_logged_in true when user is logged in (status 200)', async () => {
        const user = new UserModel(true);
        let eventCheckUserLogin = "done-check-user-login-test-true";

        expect.hasAssertions();
        // It’s a good practice to specify a number of expected assertions in async tests,
        // so the test will fail if your assertions weren’t called at all.

        Emitter.on(eventCheckUserLogin, () => {
            expect(user._data.is_logged_in).
                toBeTruthy();
        });

        const data = {ID: 321};
        const resp = {
            status: 200,
            json: () => Promise.resolve(data),
        };

        AjaxModule.doGet.mockResolvedValueOnce(resp);
        await user.isLoggedIn({eventCheckUserLogin});
    });

    it('should set _data.is_logged_in false when user is not logged in (status 401)', async () => {
        const user = new UserModel(true);
        let eventCheckUserLogin = "done-check-user-login-test-false";

        expect.hasAssertions();
        Emitter.on(eventCheckUserLogin, () => {
            expect(user._data.is_logged_in).
                toBeFalsy();
        });

        const resp = {
            status: 401,
        };

        AjaxModule.doGet.mockResolvedValueOnce(resp);
        await user.isLoggedIn({eventCheckUserLogin});
    });

    it('should set _data.id to user ID when user is logged in (status 200)', async () => {
        const user = new UserModel(true);
        let eventCheckUserLogin = "done-check-user-login-ID";

        expect.hasAssertions();
        Emitter.on(eventCheckUserLogin, () => {
            expect(user._data.id).
                toEqual(data.ID);
        });

        const data = {ID: 321};
        const resp = {
            status: 200,
            json: () => Promise.resolve(data),
        };

        AjaxModule.doGet.mockResolvedValueOnce(resp);
        await user.isLoggedIn({eventCheckUserLogin});
    });
});