const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../..");

chai.use(chaiHttp);
chai.should();

const testUser = {
  id: 0,
  username: "user",
  email: "email@savednotes.xyz",
  password: "User@123X",
};

const testNote = {
  id: 0,
  userId: 0,
  title: "Test Note",
  content: "This is a testing note",
  privacy: "public",
  archived: "0",
  trashed: "0",
  lastUpdate: new Date(),
  createdAt: new Date(),
};

let token;
let theNote;

describe("Notes", () => {
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/subscribe")
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/login")
      .send({ email: testUser.email, password: testUser.password })
      .end((err, res) => {
        token = res.body.token;
        testNote.userId = res.body.user.id;
        testUser.id = res.body.user.id;
        res.should.have.status(200);
        done(err);
      });
  });

  before((done) => {
    const { userId, title, content, privacy } = testNote;
    chai
      .request(server)
      .post("/api/v1/notes")
      .send({ userId, title, content, privacy })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        testNote.id = res.body.note.id;
        res.should.have.status(200);
        done(err);
      });
  });

  after((done) => {
    chai
      .request(server)
      .delete(`/api/v1/users/`)
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  describe("GET /notes", function () {
    it("should fetch all the public notes (excluding `trashed`)", (done) => {
      chai
        .request(server)
        .get(`/api/v1/notes/all/${testUser.id}`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done(err);
        });
    });

    it("should fetch all the notes of a specific user (excluding `trashed`)", (done) => {
      chai
        .request(server)
        .get(`/api/v1/notes/myAll/${testUser.id}`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eq(1);
          done(err);
        });
    });

    // it("should fetch all the public notes of a specific user (excluding `trashed`)", (done) => {
    //   chai
    //     .request(server)
    //     .get(`/api/v1/notes/public/${testUser.id}`)
    //     .set("authorization", `Bearer ${token}`)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a("array");
    //       res.body.length.should.be.eq(1);
    //       done(err);
    //     });
    // });

    // it("should fetch all the private notes of a specific user (excluding `trashed`)", (done) => {
    //   chai
    //     .request(server)
    //     .get(`/api/v1/notes/private/${testUser.id}`)
    //     .set("authorization", `Bearer ${token}`)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a("array");
    //       done(err);
    //     });
    // });

    // it("should fetch all the archived notes of a specific user (excluding `trashed`)", (done) => {
    //   chai
    //     .request(server)
    //     .get(`/api/v1/notes/archived/${testUser.id}`)
    //     .set("authorization", `Bearer ${token}`)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a("array");
    //       res.body.length.should.be.eq(0);
    //       done(err);
    //     });
    // });

    // it("should fetch all the trashed notes of a specific user (excluding `trashed`)", (done) => {
    //   chai
    //     .request(server)
    //     .get(`/api/v1/notes/trashed/${testUser.id}`)
    //     .set("authorization", `Bearer ${token}`)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a("array");
    //       res.body.length.should.be.eq(0);
    //       done(err);
    //     });
    // });

    it("should fetch all the notes of a specific user", (done) => {
      chai
        .request(server)
        .get(`/api/v1/notes/user/${testUser.id}`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eq(1);
          theNote = res.body[0];
          done(err);
        });
    });

    it("should fetch note by it's id", (done) => {
      chai
        .request(server)
        .get(`/api/v1/notes/${theNote.id}`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body[0].userId.should.be.eq(testUser.id);
          res.body[0].title.should.be.eq(testNote.title);
          res.body[0].content.should.be.eq(testNote.content);
          res.body[0].privacy.should.be.eq(testNote.privacy);
          res.body[0].archived.should.be.eq(0);
          res.body[0].trashed.should.be.eq(0);
          done(err);
        });
    });

    it("should search for a note", (done) => {
      chai
        .request(server)
        .get(`/api/v1/notes/search/${theNote.title}`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body[0].userId.should.be.eq(testUser.id);
          res.body[0].title.should.be.eq(testNote.title);
          res.body[0].content.should.be.eq(testNote.content);
          res.body[0].privacy.should.be.eq(testNote.privacy);
          res.body[0].archived.should.be.eq(0);
          res.body[0].trashed.should.be.eq(0);
          done(err);
        });
    });
  });

  describe("PATCH /notes", function () {
    it("should update a note", (done) => {
      chai
        .request(server)
        .patch(`/api/v1/notes/`)
        .send({
          id: theNote.id,
          title: "new note",
          content: "new content",
          archived: "1",
          privacy: "private",
          trashed: "0",
        })
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.eq("The Note Was Updated Successfully.");
          done(err);
        });
    });
  });

  describe("DELETE /notes", function () {
    it("should delete a note by it's id", (done) => {
      chai
        .request(server)
        .delete(`/api/v1/notes/${theNote.id}`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.eq("The Note Was Deleted Successfully.");
          done(err);
        });
    });
  });
});
