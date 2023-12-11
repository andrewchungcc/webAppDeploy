import {
  createMember,
  getMembers,
  getFavorite,
  getSignupMembers,
  getTargetMembers,
  getMemberdata,
  updateMember,
  updateMemberData,
  updateMemberFavBooks,
  updatePassword,
  deleteMemberdata,
  forgetEmail
} from "../controllers/member.js";
import express from "express";

// Create an express router
const router = express.Router();

// Every path we define here will get /api/members prefix
// To make code even more cleaner we can wrap functions in `./controllers` folder

// GET /api/members
router.get("/", getMembers);
// GET /api/members/signup
router.get("/signup", getSignupMembers);
// GET /api/members/target
router.get("/target", getTargetMembers);
// GET /api/members/favorite
router.get("/favorite", getFavorite);
// GET /api/members/memberdata
router.get("/memberdata", getMemberdata);
// GET /api/members/memberdata
router.get("/forgetemail", forgetEmail);
// POST /api/members
router.post("/", createMember);
// PUT /api/members
router.put("/", updateMember);
// PUT /api/members
router.put("/resetPassword", updatePassword);
// PUT /api/members/memberdata
router.put("/memberdata", updateMemberData);
// PUT /api/members/target
router.put("/target", updateMemberFavBooks);
// DELETE /api/members/:id
router.delete("/memberdata", deleteMemberdata);

// export the router
export default router;
