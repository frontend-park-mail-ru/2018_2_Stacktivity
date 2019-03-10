import UserModel from "./UserModel";
import Emitter from "../modules/Emitter";
import AjaxModule from "../modules/Ajax";
import User from "../components/game/models/User/User.js";

jest.mock('../modules/Ajax');

describe('UserModel: update', () => {
    it('should emit update-success on status 200', async (done) => {
        Emitter.on('update-success', () => {
            done();
        });

        const user = new UserModel(true);
        const resp = Promise.resolve({status: 200});
        const data = {username: "ada"};

        AjaxModule.doPut.mockResolvedValueOnce(resp);
        await user.update(data);
    });


    it('should emit update-error on other status', async (done) => {
        Emitter.on('update-error', () => {
            done();
        });

        const user = new UserModel(true);
        const resp = Promise.resolve({status: 400});
        const data = {username: "ada"};

        AjaxModule.doPut.mockResolvedValueOnce(resp);
        await user.update(data);
    });

    it('should erase _data when update is success', async () => {
        expect.hasAssertions();

        const user = new UserModel(true);
        const eventName = 'update-check-erasing';
        Emitter.on(eventName, () => {
            expect(Object.entries(user._data).length).toEqual(0);
        });

        const resp = Promise.resolve({status: 200});
        const data = {username: "ada"};

        AjaxModule.doPut.mockResolvedValueOnce(resp);
        await user.update(data, {updateSuccess: eventName});
    });
});