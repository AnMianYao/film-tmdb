let user={
  insert:'INSERT INTO USER(id,username,password,favors) VALUES(0,?,?,?)',
  update:"update user set favors=? where username=?",
  delete:"delete from user where username=?",
  queryAll:"select * from user",
  getPassword:"select password from user where username=?",
  isNameToken:"select username from user where username=?",
  getFavor:"select favors from user where username=?",
};
module.exports=user;
