const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../..");

chai.use(chaiHttp);
chai.should();

const testUser = {
  id: 0,
  username: "user",
  email: "user@savednotes.xyz",
  password: "User@123X",
};

let token;

describe("Users", () => {
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
        res.should.have.status(200);
        done(err);
      });
  });

  after((done) => {
    chai
      .request(server)
      .delete(`/api/v1/users`)
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  describe("GET /users", () => {
    it("should fetch a user data", (done) => {
      chai
        .request(server)
        .get("/api/v1/users")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("result");
          done(err);
        });
    });
  });

  describe("PATCH /users", () => {
    it("should update a user", (done) => {
      chai
        .request(server)
        .patch("/api/v1/users")
        .set("authorization", `Bearer ${token}`)
        .send({ username: "updated username", newPassword: "new password" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.success.should.be.eq(true);
          done(err);
        });
    });
  });
});
