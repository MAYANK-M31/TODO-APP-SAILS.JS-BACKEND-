/**
 * TasksController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { v4: uuidv4 } = require("uuid");

module.exports = {
  getTasks: async (req, res) => {
    const { boardId } = req.query;
    try {
      await Tasks.find({boardId:boardId})
        .sort([{ createdAt: "DESC" }])
        .then((task, err) => {
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
            payload: { data: task },
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

  postTask: async (req, res) => {
    const { boardId, description, completed } = req.body;
    const RANDOM_ID = uuidv4();
    console.log(req.body);
    try {
      await Boards.findOne({ id: boardId }, (err, board) => {
        if (err) {
          return res.serverError({
            status: 500,
            message: "Server Error",
            error: err,
          });
        }

        if (!board) {
          return res.ok({
            status: 500,
            message: "Invalid BoardId",
          });
        }

        const Body = {
          id: RANDOM_ID,
          description: description,
          boardId: boardId,
          createdAt: new Date(Date.now()).getTime(),
          completed: completed,
        };

        return Tasks.create(Body, (err, task) => {
          if (err) {
            return res.serverError({
              status: 500,
              message: "Server Error",
              error: err,
            });
          }

          return res.ok({
            status: 200,
            message: "Task Added Successfully",
            payload: { data: Body },
          });
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

  editTask: async (req, res) => {
    const { taskId, completed, description } = req.body;
    try {
      var Body;

      if (completed != null && description != null) {
        Body = {
          completed: completed,
          description: description,
        };
      } else {
        console.log(completed, description);

        if (completed) {
          Body = {
            completed: completed,
          };
        }

        if (description) {
          Body = {
            description: description,
          };
        }
      }

      console.log(Body);

      return Tasks.updateOne({ id: taskId })
        .set(Body)
        .then((done, err) => {
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
              message: "Unable to Update Task",
              error: "Invalid TaskId",
            });
          }

          return res.ok({
            status: 200,
            message: "Task Updated  Successfully",
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

  deleteTask: async (req, res) => {
    const { taskId } = req.body;

    try {
      return Tasks.destroyOne({ id: taskId }, (err, done) => {
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
            message: "Unable to Delete Task",
            error: "Invalid TaskId",
          });
        }

        return res.ok({
          status: 200,
          message: "Task Deleted Successfully",
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
