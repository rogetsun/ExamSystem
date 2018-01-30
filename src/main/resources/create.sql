# DROP DATABASE IF EXISTS exam;
# CREATE DATABASE exam
#   DEFAULT CHARACTER SET = 'UTF8';
# USE exam;
# 老师表
DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher (
  tch_id     INT AUTO_INCREMENT PRIMARY KEY,
  tch_login  VARCHAR(50) NOT NULL UNIQUE
  COMMENT '工号',
  tch_name   VARCHAR(20) NOT NULL,
  tch_passwd VARCHAR(100),
  in_time    VARCHAR(20) COMMENT '入职时间',
  tch_title  VARCHAR(20) COMMENT '职称',
  tch_gender VARCHAR(1) COMMENT '性别',
  note       VARCHAR(250)
)
  ENGINE = innodb;

INSERT INTO teacher (tch_login, tch_name, tch_passwd, in_time, tch_title, tch_gender, note)
VALUES ('admin', '系统', md5(md5('admin')), NULL, '系统默认管理员', NULL, NULL);

# 学生表
DROP TABLE IF EXISTS student;
CREATE TABLE student (
  std_id     INT AUTO_INCREMENT PRIMARY KEY,
  std_login  VARCHAR(50) NOT NULL UNIQUE
  COMMENT '学号',
  std_name   VARCHAR(20) NOT NULL,
  std_passwd VARCHAR(100),
  std_gender CHAR(1) COMMENT '学生性别',
  in_time    VARCHAR(20) COMMENT '入学时间LONG',
  cls_no     VARCHAR(20) COMMENT '班号'
)
  ENGINE = innodb;

# 班级表
DROP TABLE IF EXISTS class;
CREATE TABLE class (
  cls_id     INT AUTO_INCREMENT PRIMARY KEY,
  cls_no     VARCHAR(20) NOT NULL UNIQUE
  COMMENT '班号',
  major_id   INT         NOT NULL
  COMMENT '专业ID',
  begin_time VARCHAR(20) COMMENT '开班时间',
  end_time   VARCHAR(20) COMMENT '毕业时间',
  note       VARCHAR(200)
)
  ENGINE = innodb;

# 专业表
DROP TABLE IF EXISTS major;
CREATE TABLE major (
  major_id   INT PRIMARY KEY AUTO_INCREMENT,
  major_name VARCHAR(50) COMMENT '专业名称' NOT NULL,
  major_no   VARCHAR(20) COMMENT '专业编号' NOT NULL,
  fac_id     INT COMMENT '所属院系'         NOT NULL
)
  ENGINE = innodb;

# 课程表
DROP TABLE IF EXISTS course;
CREATE TABLE course (
  cos_id     INT PRIMARY KEY AUTO_INCREMENT,
  cos_name   VARCHAR(50) COMMENT '课程名称' NOT NULL,
  cos_credit VARCHAR(5) COMMENT '学分'    NOT NULL
)
  ENGINE = innodb;

# 专业课程关系表
DROP TABLE IF EXISTS major_course;
CREATE TABLE major_course (
  major_id INT NOT NULL,
  cos_id   INT NOT NULL
)
  ENGINE = innodb;

# 院系表
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty (
  fac_id   INT PRIMARY KEY AUTO_INCREMENT,
  fac_name VARCHAR(50) NOT NULL
)
  ENGINE = innodb;

# 试题表
DROP TABLE IF EXISTS question;
CREATE TABLE question (
  qt_id      INT PRIMARY KEY AUTO_INCREMENT,
  cos_id     INT COMMENT '所属课程ID' NOT NULL,
  qt_content VARCHAR(250)         NOT NULL,
  is_multi   CHAR(1) COMMENT '1:多选题,0:单选题'
)
  ENGINE = innodb;

# 试题选项表
DROP TABLE IF EXISTS question_option;
CREATE TABLE question_option (
  opt_id      INT PRIMARY KEY AUTO_INCREMENT,
  qt_id       INT NOT NULL,
  opt_title   VARCHAR(2),
  opt_content VARCHAR(250),
  is_right    CHAR(1) COMMENT '1:正确答案'
)
  ENGINE = innodb;

# 试卷表
DROP TABLE IF EXISTS paper;
CREATE TABLE paper (
  paper_id    INT PRIMARY KEY AUTO_INCREMENT,
  cos_id      INT NOT NULL,
  paper_title VARCHAR(100),
  score       VARCHAR(5) COMMENT '总分',
  pass_score  VARCHAR(5) COMMENT '及格分数'
)
  ENGINE = innodb;

# 试卷题目表
DROP TABLE IF EXISTS paper_question;
CREATE TABLE paper_question (
  paper_id INT        NOT NULL,
  qt_id    INT        NOT NULL,
  score    VARCHAR(5) NOT NULL DEFAULT '1'
  COMMENT '分值'
)
  ENGINE = innodb;

# 考试表
DROP TABLE IF EXISTS examination;
CREATE TABLE examination (
  exam_id    INT PRIMARY KEY     AUTO_INCREMENT,
  exam_title VARCHAR(100) COMMENT '考试标题',
  cos_id     INT        NOT NULL
  COMMENT '考试课程',
  paper_id   INT COMMENT '考试试卷',
  score      VARCHAR(5) COMMENT '考试总分',
  pass_score VARCHAR(5) NOT NULL DEFAULT '60'
  COMMENT '及格分',
  begin_time VARCHAR(20) COMMENT '考试开始时间',
  duration   VARCHAR(20) COMMENT '考试时长'
)
  ENGINE = innodb;

# 考试发布表
DROP TABLE IF EXISTS exam_publish;
CREATE TABLE exam_publish (
  exam_id INT NOT NULL,
  cls_id  INT NOT NULL
)
  ENGINE = innodb;

# 考试成绩表
DROP TABLE IF EXISTS student_exam;
CREATE TABLE student_exam (
  exam_id INT NOT NULL
  COMMENT '考试ID',
  std_id  INT NOT NULL
  COMMENT '学生ID',
  score   VARCHAR(5) COMMENT '成绩'
)
  ENGINE = innodb;

# 学生课程考试
DROP TABLE IF EXISTS student_course_exam;
CREATE TABLE student_course_exam (
  std_id  INT NOT NULL,
  cos_id  INT NOT NULL,
  score   VARCHAR(5),
  is_pass CHAR(1),
  exam_id INT
)
  ENGINE = innodb;



