/**
 * BoardsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { v4: uuidv4 } = require("uuid");

module.exports = {
  getBoards: async (req, res) => {
    try {
      await Boards.find((err, board) => {
        if (err) {
          return res.serverError({
            status: 500,
            message: "Server Error",
            error: err,
          });
        }

        return res.ok({
          status: 200,
          message: "Data Fetched",
          payload: { data: board },
        });
      });
    } catch (err) {
      console.log(err);
      return res.serverError({
        status: 500,
        message: "Server Error2",
        error: err,
      });
    }
  },

  postBoard: async (req, res) => {
    const RANDOM_ID = uuidv4();
    try {
      const Body = {
        id: RANDOM_ID,
        createdAt: new Date(Date.now()).getTime(),
      };
      return Boards.create(Body, (err, task) => {
        if (err) {
          return res.serverError({
            status: 500,
            message: "Server Error",
            error: err,
          });
        }

        return res.ok({
          status: 200,
          message: "Board Added Successfully",
          payload: { data: Body },
        });
      });
    } catch (err) {
      console.log(err);
      return res.serverError({
        status: 500,
        message: "Server Error2",
        error: err,
      });
    }
  },

  deleteBoard: async (req, res) => {
    const { boardId } = req.body;

    try {
      return Boards.destroyOne({ id: boardId }, (err, done) => {
        if (err) {
          return res.serverError({
            status: 500,
            message: "Server Error",
            error: err,
          });
        }

        if (!done) {
          return res.ok({
            status: 500,
            message: "Unable to Delete Board",
            error: "Invalid BoardId",
          });
        }

        return Tasks.destroy({ boardId: boardId }, (err, done) => {
          if (err) {
            return res.serverError({
              status: 500,
              message: "Server Error",
              error: err,
            });
          }
          return res.ok({
            status: 200,
            message: "Board Deleted Successfully",
          });
        });
      });
    } catch (err) {
      console.log(err);
      return res.serverError({
        status: 500,
        message: "Server Error",
        error: err,
      });
    }
  },
};
