import http from "k6/http";
import { check, fail } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// import { SharedArray } from "k6/data";

const baseUrl = "https://he-dev-api.sourcef.us";
const roleId = "a101182b-5074-2cb1-ccfc-7e829adc6a66";
const tenantId = "d671a767-40cf-471d-fc4a-a4ddd4137b37";
let SignUp_Token = "";
let Login_Token = "";
let Login_refresh_token = "";
let newRefreshToken = " ";
let newLoginToken = "";
let course_id = "";
let topic_id = "";
// Test setup

//init Section
export let options = {
    duration: "1s",
    vus: 1,
};

let randomInt = Math.floor(Math.random() * 1000000);
const randomFirstName = randomString(8);
const randomMiddle_Name = randomString(8);
const randomLastName = randomString(8);

//Vu Script
export default function() {
    signUpUser();
    loginUser();
    // logout();
    courseGroup();
    createCourse();
    // deleteCourse();
    getCourseUpdateCourse();
    createTopics();
    topicCopy();
    // getCourseDetails();
    // deleteTopics();
    topicContentgrpFindAll();
}
/**
 *
 */
function signUpUser() {
    let payload = {
        email: `john.doe+${randomInt}@sf.com`,
        password: "Testing123#",
        roleId: `${roleId}`,
        tenantId: `${tenantId}`,
        firstName: `${randomFirstName}`,
        middleName: `${randomMiddle_Name}`,
        lastName: `${randomLastName}`,
    };
    // send post request with custom header and payload
    /**
     * SignUp User
     *
     */
    try {
        let response = http.post(
            `${baseUrl}/auth-facade/auth/sign-up`,
            JSON.stringify(payload),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (
            !check(response, {
                "Status code must be 200 For Sign_up": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        SignUp_Token = response.json().token;
    } catch (error) {
        console.log(error);
    }
    try {
        let response1 = http.post(
            `${baseUrl}/auth-facade/auth/sign-up/verify`,
            null,

            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SignUp_Token}`,
                },
            }
        );
        // console.log(response1.status);
        if (
            !check(response1, {
                "Status code MUST be 200 for SignUp Verify": (response) =>
                    response.status == 200,
            })
        ) {
            fail(`Failed Status code is ${response1.status} not 200`);
        }
    } catch (error) {
        console.log(error);
    }
    let payload3 = {
        password: "Testing123#",
        client_secret: "qazxsw1029!@",
        client_id: "mobileapp",
    };

    try {
        let response2 = http.post(
            `${baseUrl}/auth-facade/auth/sign-up/create-user`,
            JSON.stringify(payload3),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SignUp_Token}`,
                },
            }
        );
        // console.log(response2.status);
        if (
            !check(response2, {
                "Status code MUST be 200 for Create User Sucessfully": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
    } catch (error) {
        console.log(error);
    }
}

function loginUser() {
    let payload4 = {
        client_secret: "qazxsw1029!@",
        client_id: "mobileapp",
        username: "atifkhansf@gmail.com",
        password: "Testing123#",
    };
    try {
        let response3 = http.post(
            `${baseUrl}/auth-facade/auth/login`,
            JSON.stringify(payload4),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (
            !check(response3, {
                "Status code MUST be 200 for User Login Sucessfully": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        Login_Token = response3.json().accessToken;
        Login_refresh_token = response3.json().refreshToken;
        // console.log("Login_Refresh_token:", Login_refresh_token);
    } catch (error) {
        console.log(error);
    }

    let payload5 = {
        refreshToken: `${Login_refresh_token}`,
    };
    try {
        let response4 = http.post(
            `${baseUrl}/auth-facade/auth/token-refresh`,
            JSON.stringify(payload5),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${Login_Token}`,
                },
            }
        );
        if (
            !check(response4, {
                "Status code MUST be 200 for Login Refresh Token": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        newLoginToken = response4.json().accessToken;
        // console.log("lll", newLoginToken);
        newRefreshToken = response4.json().refreshToken;
        // console.log("refresh_token",newRefreshToken);
    } catch (error) {
        console.log(error);
    } // console.log("Login_Refresh_Token:", Login_refresh_token);

    try {
        let response5 = http.get(`${baseUrl}/auth-facade/auth/me`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${newLoginToken}`,
            },
        });
        // console.log("Print_newlogintoken",newLoginToken);
        // console.log(response5.status);
        if (
            !check(response5, {
                "Status code MUST be 200 for Auth me Login Details": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
    } catch (error) {
        console.log(error);
    }
}

function logout() {
    let payload6 = {
        refreshToken: `${newRefreshToken}`,
    };
    try {
        let response6 = http.post(
            `${baseUrl}/auth-facade/logout`,
            JSON.stringify(payload6),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        // console.log(response6);
        if (
            !check(response6, {
                "Status code MUST be 200 for User LogOut Sucessfully": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
    } catch (error) {
        console.log(error);
    }
}
function courseGroup() {
    try {
        let response5 = http.get(`${baseUrl}/content-facade/course-group`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${newLoginToken}`,
            },
        });
        // console.log("Print_newlogintoken",newLoginToken);
        // console.log(response5.status);
        if (
            !check(response5, {
                "Status code MUST be 200 for Get CourseGroup Details": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
    } catch (error) {
        console.log(error);
    }
}
function createCourse() {
    let payload6 = {
        code: "99999",
        name: `${Date.now()}`,
        description: "eduction",
        previewUrl: "string",
    };
    try {
        let response6 = http.post(
            `${baseUrl}/content-facade/course`,
            JSON.stringify(payload6),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        // console.log("Print_newlogintoken",newLoginToken);
        // console.log(response6.body);
        // console.log("Response of Created Course_id", response6.status)
        console.log("Course_id created", response6.json().id);
        if (
            !check(response6, {
                "Status code MUST be 200 for Course is Created": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        course_id = response6.json().id;
        return course_id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        console.log(error);
    }
}
function deleteCourse() {
    let course2 = createCourse();
    console.log("course_id created for Deletion", course2);

    try {
        let response9 = http.del(
            `${baseUrl}/content-facade/course/${course2}`,
            null,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        // console.log("Print_newlogintoken",newLoginToken);
        // console.log(response6.body);
        // console.log(response9.status)
        console.log(response9.json());
        if (
            !check(response9, {
                "Status code MUST be 200 for Course Deleted Successfully": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        // course_id= response8.json().id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        console.log(error);
    }
}
function getCourseUpdateCourse() {
    // let course3 = createCourse();

    try {
        let response7 = http.get(`${baseUrl}/content-facade/course/${course_id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${newLoginToken}`,
            },
        });
        // console.log("Print_newlogintoken",newLoginToken);
        console.log("getupdate", course_id);
        // console.log(response7.json());
        if (
            !check(response7, {
                "Status code MUST be 200 for Get Created Course Details": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
    } catch (error) {
        console.log(error);
    }
    let payload8 = {
        code: "34567",
        name: `${randomFirstName}`,
        description: "eduction",
        previewUrl: "string",
    };
    try {
        let response8 = http.patch(
            `${baseUrl}/content-facade/course/${course_id}`,
            JSON.stringify(payload8),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        // console.log("Print_newlogintoken",newLoginToken);
        // console.log(response6.body);
        // console.log(response8.json());
        console.log("updateCourse_id is", course_id);
        if (
            !check(response8, {
                "Status code MUST be 200 for Course update with Course_id": (
                    response
                ) => response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        // course_id= response8.json().id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        console.log(error);
    }
}
function createTopics() {
    let payload9 = {
        name: `${Date.now()}`,
        description: "eduction",
        notes: "Adela Falls",
        previewUrl: "string",
    };
    try {
        let response9 = http.post(
            `${baseUrl}/content-facade/course/${course_id}/topics`,
            JSON.stringify(payload9),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        // console.log("Print_newlogintoken",newLoginToken);
        // console.log(response6.body);
        // console.log("Response of Created Course_id", response6.status)
        // console.log("Course_id created",response9.json().id);
        if (
            !check(response9, {
                "Status code MUST be 200 for Topic is Created": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        topic_id = response9.json().id;
        // return topic_id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        console.log(error);
    }
    // function topicCopy(){
    try {
        let response10 = http.post(
            `${baseUrl}/content-facade/topics/${topic_id}/copy`,
            null,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        console.log(response10.status);
        if (
            !check(response10, {
                "Status code MUST be 200 for Topic is Copy ": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        // topic_id= response10.json().id;
        // return topic_id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        console.log(error);
    }
    // function getCourseDetails(){
    console.log("newlogin_token", newLoginToken);

    try {
        let response11 = http.get(
            `${baseUrl}/content-facade/course/${course_id}/topics/${topic_id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        // console.log("newlogin_token",newLoginToken);
        // console.log("Response of copy text", response11.json());
        // console.log(response11.status);

        if (
            !check(response11, {
                "Status code MUST be 200 for Get Course Deatiles with Course_id and Topic_id ": (
                    response
                ) => response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        // topic_id= response10.json().id;
        // return topic_id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        console.log("Error of copy text", error);
    }
    try {
        let response11 = http.get(
            `${baseUrl}/content-facade/course/${course_id}/topics`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        // console.log("newlogin_token",newLoginToken);
        // console.log("Response of copy text", response11.json());
        // console.log(response11.status);

        if (
            !check(response11, {
                "Status code MUST be 200 for Get Topic Details with course_id ": (
                    response
                ) => response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        // topic_id= response10.json().id;
        // return topic_id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        // console.log("Error of copy text", error);
    }
}
function deleteTopics() {
    // let course2 = createCourse();
    // console.log("course_id created for Deletion", course2);
    try {
        let response12 = http.del(
            `${baseUrl}/content-facade/course/${course_id}/topic/${topic_id}`,
            null,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        )
        // console.log("Print_newlogintoken",newLoginToken);
        // console.log(response6.body);
        // console.log(response9.status)
        console.log(response12.json());
        if (
            !check(response12, {
                "Status code MUST be 200 for Topic Deleted Successfully": (response) =>
                    response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }
        // course_id= response8.json().id;
        // console.log("course_id",course_id);
        // console.log(response6.json().name);
    } catch (error) {
        console.log(error);
    }
}
function topicContentgrpFindAll()
{
    console.log("topic id is", topic_id);
    try {
        let response13 = http.get(
            `${baseUrl}/content-facade/topics/${topic_id}/topic-content-groups`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${newLoginToken}`,
                },
            }
        );
        if (
            !check(response13, {
                "Status code MUST be 200 for Topic content grp find All ": (response) => response.status == 200,
            })
        ) {
            fail("status code was *not* 200");
        }

    } catch (error) {
        console.log("Error of topiccontentgrpid", error);
    }
}