import MemberModel from "../models/memberModel.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


export const getSignupMembers = async (req, res) => {
  try {
    const { account } = req.query;
    // 不需要驗證，因為尚未登入僅是註冊階段
    
    const members = await MemberModel.findOne({ 'account': account });

    // Return members
    return res.status(200).json(members);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

export const getTargetMembers = async (req, res) => {
  try {
    const { account } = req.query;
    
    // console.log(account);
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

    // Verify the JWT token
    const decoded = jwt.verify(account, secretKey);

    // Query the database for members
    const members = await MemberModel.findOne({ 'account': decoded.account });

    // Return members
    return res.status(200).json(members);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};


// get members
export const getMembers = async (req, res) => {
  const {account, password} = req.query;
  if (!account || !password) {
    return res
      .status(400)
      .json({ message: "Account or password is not correct!" });
  }

  try {
    const members = await MemberModel.findOne({'account':account, 'password':password});
    if (!members){
      console.log("Log in fail QQ");
      return res.status(200).json(members);;
    }
    
    //  Generate JWT token
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';
    const token = jwt.sign({ 'account':account }, secretKey, { expiresIn: '1h' });
    
    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a member
export const createMember = async (req, res) => {
  const { name, email, account, password, creditCard } = req.body;

  // Check title and description
  if (!name || !email || !account || !password || !creditCard) {
    return res
      .status(400)
      .json({ message: "Information are required!" });
  }

  // Create a new member
  try {
    const newMember = await MemberModel.create({
      name, 
      email,
      account, 
      password, 
      creditCard
    });
    return res.status(201).json(newMember);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a member fav book
export const updateMember = async (req, res) => {
  try {
    const { account, bookName } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

    // Verify the JWT token
    const decoded = jwt.verify(account, secretKey);

    // console.log("updateMember:", decoded.account);

    
    const members = await MemberModel.findOne({'account':decoded.account});
    if (!members){
      console.log("fail QQ");
    }
    
    
    members.favorite.addToSet(bookName);
    members.save();

    return res.status(200).json(members);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    } else{
      return res.status(500).json({ message: error.message });
    }
  }
};

// Update a member favorite book
export const updateMemberFavBooks = async (req, res) => {
  try {
    const { account, bookName } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

    // Verify the JWT token\
    // console.log( account );
    const decoded = jwt.verify(account, secretKey);
    // console.log("updateMember", decoded.account);
  
    const result = await MemberModel.updateOne(
      { 'account': decoded.account },
      { $pull: { 'favorite': { $in: [bookName] } } }
    );
    // console.log(result);

    if (!result || result.nModified === 0) {
      return res.status(404).json({ message: "Member not found!" });
    }

    return res.status(200).json({ message: "Member deleted successfully!" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    } else{
      return res.status(500).json({ message: error.message });
    }
  }
};

// Get a member favorite book
export const getFavorite = async (req, res) => {
  try {
    const { account, bookName } = req.query;
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

    // Verify the JWT token
    const decoded = jwt.verify(account, secretKey);

    // console.log("getFavorite:", decoded.account);

    const members = await MemberModel.findOne({"account":decoded.account});
    
    // 檢查是否在favorite，並回傳true or false
    const isBookInFavorites = members.favorite.includes(bookName);
  
    return res.status(200).json(isBookInFavorites)
  
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    } else{
      return res.status(500).json({ message: error.message });
    }
  }

};



// Get a member data
export const getMemberdata = async (req, res) => {
  // console.log('Request received:', req.url);
  // console.log('Query parameters:', req.query);
  try {
    const { account } = req.query;
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

    // Verify the JWT token
    const decoded = jwt.verify(account, secretKey);

    // console.log("getMemberdata:", decoded.account);

    const members = await MemberModel.findOne({"account":decoded.account});
    // console.log(members);
    return res.status(200).json(members)
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    } else{
      return res.status(500).json({ message: error.message });
    }
  }

};


// Delete a member 
export const deleteMemberdata = async (req, res) => {
  try {
    const { account } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

    // Verify the JWT token
    const decoded = jwt.verify(account, secretKey);

    // console.log("deleteMemberdata:", decoded.account);

    // const members = await MemberModel.findOne({"account":decoded.account});
  // console.log(members);
  // const { userId } = req.body;
  // console.log('Request Body:', req.body);
  // console.log('Deleting member with userId:', userId);

    const result = await MemberModel.deleteOne({ 'account': decoded.account });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Member not found!" });
    }

    return res.status(200).json({ message: "Member deleted successfully!" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    } else{
      return res.status(500).json({ message: error.message });
    }
  }
};

// change member data
export const updateMemberData = async (req, res) => {
  try {  
  // console.log(req.body);
  const { account, name, email, password,  creditCard } = req.body;
  // console.log(account, name, email, password,  creditCard );
  const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

  // Verify the JWT token
  const decoded = jwt.verify(account, secretKey);


  // 更新 MemberModel，使用 $set 操作符设置新的值
  const result = await MemberModel.updateOne(
      { 'account': decoded.account },
      {
        $set: {
          'name': name,
          'email': email,
          'password': password,
          'creditCard': creditCard
        }
      }
  );

  // 检查是否找到了成员并成功更新
  if (!result || result.nModified === 0) {
    return res.status(404).json({ message: "成员未找到或未进行任何更改！" });
  }

  // 返回成功消息
  return res.status(200).json({ message: "成员数据已成功更新！" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    } else{
      return res.status(500).json({ message: error.message });
    }
  }
};

// Example route for handling forget password request
export const forgetEmail = async(req, res) => {
  const {userEmail} = req.query;
  console.log(userEmail);

  // A simple in-memory database to store verification codes and their associated email addresses
  const verificationCodes = new Map();

  // Generate a random verification code
  const verificationCode = crypto.randomBytes(3).toString('hex'); // Change the length as needed

  // Store the verification code in the database
  verificationCodes.set(userEmail, verificationCode);
  // console.log(verificationCodes)

  // Example email sending code with nodemailer
  const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
    auth: {
      user: 'webappr11@gmail.com',
      // pass: 'R11722015'
      pass:'beoi ltou uifs zhef'
    }
  });

  const mailOptions = {
    from: 'webappr11@gmail.com',
    to: userEmail,
    subject: 'Web app Password Reset',
    text: `Your verification code is: ${verificationCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    } else {
      // console.log('Email sent: ' + info.response);
      console.log('Email sent: ', verificationCode);
      return res.status(200).json(verificationCode);
    }
  });
};

export const updatePassword = async(req, res) => {
  const {account, password} = req.body;
  // console.log(account, password);
  

  try{

    const result = await MemberModel.updateOne(
      { 'account': account },
      {
        $set: {
          'password': password,
        }
      }
  );

  // check if update is successful
  if (!result || result.nModified === 0) {
    return res.status(404).json({ message: "update fail!" });
  }
  console.log(`Password reset for ${account}. New Password: ${password}. `);

  return res.status(200).send(password);

  } catch(error) {
    res.status(400).send('Invalid verification code');
  }


};