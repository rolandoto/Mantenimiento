const supertest = require("supertest");
const request = require("../src/index");
const expect = require("chai").expect;

describe("GET /environment/getEnvironments", (_) => {
    it("Get all environments", (done) => {
        supertest(request)
            .get("/environment/getEnvironments")
            .set("Accept", "application/json")
            .set(
                "Authorization",
                "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
            )
            .expect("Content-Type", /json/)
            .expect((response) => {
                expect(response.status).to.eql(200);
                expect(response.body.message).to.eql("Se han encontrado ambientes");
            })
            .end((err) => {
                if (err) return done(err);

                return done();
            });
    });
});

describe("GET /environment/getEnvironment/$id", (_) => {
    it("Get specific environment", (done) => {
        supertest(request)
            .get("/environment/getEnvironment/5fd6b614c70f610be19955f8")
            .set("Accept", "application/json")
            .set(
                "Authorization",
                "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
            )
            .expect("Content-Type", /json/)
            .expect((response) => {
                expect(response.status).to.eql(200);
                expect(response.body.message).to.eql("Se han encontrado el ambiente");
            })
            .end((err) => {
                if (err) return done(err);

                return done();
            });
    });

    it("Get specific environment, bad id", (done) => {
        supertest(request)
            .get("/environment/getEnvironment/5fd6b614c70f610be19955f")
            .set("Accept", "application/json")
            .set(
                "Authorization",
                "eyJhbGciOiJIUzI1NiJ9.NWZkNTA5ZmU1OGZhMjcwM2UzNWUwY2M1.Tr-3wFgTrNwYxyhxmK2_8E-57jmyaGVi_ZQrRkbSTPM"
            )
            .expect("Content-Type", /json/)
            .expect((response) => {
                expect(response.status).to.eql(400);
                expect(response.body.message).to.eql("El ID suministrado es incorrecto");
            })
            .end((err) => {
                if (err) return done(err);

                return done();
            });
    });
});
