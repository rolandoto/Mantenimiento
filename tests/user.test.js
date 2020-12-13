// describe("POST /user/login", (_) => {
//     it("Login user, incorrect credentials", (done) => {
//         supertest(request)
//             .post("/user/login")
//             .send({
//                 email: "kismu35891@gmail.com",
//                 password: "123",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql(
//                     "El usuario y/o la contraseña son incorrectos."
//                 );
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Login user, valid credentials", (done) => {
//         supertest(request)
//             .post("/user/login")
//             .send({
//                 email: "kismuteama@gmail.com",
//                 password: "123",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(200);
//                 expect(response.body.message).to.eql("Credenciales correctas.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Login user, no send data", (done) => {
//         supertest(request)
//             .post("/user/login")
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });

// describe("GET /user/authenticate", (_) => {
//     it("Authenticate token, no send token", (done) => {
//         supertest(request)
//             .get("/user/authenticate")
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El token es requerido.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Authenticate token, send incorrect token", (done) => {
//         supertest(request)
//             .get("/user/authenticate")
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTP"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("Ha ocurrido un error.");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Authenticate token, send correct token", (done) => {
//         supertest(request)
//             .get("/user/authenticate")
//             .set("Accept", "application/json")
//             .set(
//                 "Authorization",
//                 "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
//             )
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(200);
//                 expect(response.body.message).to.eql("El token es correcto");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });

// describe("POST /user/register", (_) => {
//     it("Register user, no send data", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El rol es requerido.");
//                 expect(response.body.type).to.eql("general");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Register user, send incorrect role", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .send({
//                 rolID: "123",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("Ha ocurrido un error.");
//                 expect(response.body.type).to.eql("general");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Register user, send existing email", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .send({
//                 rolID: "5fd509c32306da03d4be80bb",
//                 email: "kismuteama@gmail.com",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El email ya esta en uso.");
//                 expect(response.body.type).to.eql("email");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Register user, send existing username", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .send({
//                 rolID: "5fd509c32306da03d4be80bb",
//                 email: "kismu35891@gmail.com",
//                 username: "kismusito",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El nombre de usuario ya esta en uso.");
//                 expect(response.body.type).to.eql("username");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Register user, no send password", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .send({
//                 rolID: "5fd509c32306da03d4be80bb",
//                 email: "kismu35891@gmail.com",
//                 username: "kismu",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("La contraseña es requerida.");
//                 expect(response.body.type).to.eql("password");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Register user, no send username", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .send({
//                 rolID: "5fd509c32306da03d4be80bb",
//                 email: "kismu35891@gmail.com",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El nombre de usuario es requerdio.");
//                 expect(response.body.type).to.eql("username");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Register user, no send email", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .send({
//                 rolID: "5fd509c32306da03d4be80bb",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(400);
//                 expect(response.body.message).to.eql("El email es requerido.");
//                 expect(response.body.type).to.eql("email");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });

//     it("Register user", (done) => {
//         supertest(request)
//             .post("/user/register")
//             .send({
//                 rolID: "5fd509c32306da03d4be80bb",
//                 email: "kismu35891@gmail.com",
//                 username: "kismu",
//                 password: "123",
//             })
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect((response) => {
//                 expect(response.status).to.eql(201);
//                 expect(response.body.message).to.eql("El usuario ha sido registrado correctamente");
//                 expect(response.body.status).to.eql(true);
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });
