SELECT *
FROM teacher;


INSERT INTO teacher (tch_login, tch_name, tch_passwd, in_time, tch_title, tch_gender, note)
VALUES ('admin1', '系统', md5(md5('admin1')), UNIX_TIMESTAMP(), '教授', '男', '');

SELECT last_insert_id();

SELECT *
FROM faculty;

SELECT a.*
FROM course a
WHERE a.cos_id NOT IN (SELECT cos_id
                       FROM major_course b
                       WHERE b.major_id = 3);


SELECT *
FROM major_course;
SELECT *
FROM teacher;

SELECT *
FROM course;

INSERT INTO course (cos_name, cos_credit) VALUES
  ('计算机1', '5'), ('计算机2', '5'), ('计算机3', '5'), ('计算机4', '5'), ('计算机5', '5'), ('计算机6', '5'),
  ('计算机7', '5'), ('计算机8', '5'), ('计算机9', '5'), ('计算机10', '5'), ('计算机11', '5'), ('计算机12', '5');

SELECT *
FROM question;
SELECT *
FROM question_option;
SELECT *
FROM class;

SELECT *
FROM paper;
INSERT INTO paper_question (paper_id, qt_id, score) VALUES ();
SELECT *
FROM paper_question
WHERE paper_id = 5;

SELECT
  a.paper_id,
  a.score,
  b.cos_id,
  b.qt_id,
  b.qt_content,
  b.is_multi,
  c.opt_id,
  c.opt_title,
  c.opt_content,
  c.is_right
FROM paper_question a, question b, question_option c
WHERE a.qt_id = b.qt_id
      AND b.qt_id = c.qt_id
      AND a.paper_id = 5;


SELECT *
FROM examination;

SELECT *
FROM exam_publish;

SELECT *
FROM student;

SELECT *
FROM class;

SELECT
  a.*,
  e.cos_name,
  e.cos_credit
FROM examination a, exam_publish b, class c, student d, course e
WHERE a.exam_id = b.exam_id AND b.cls_id = c.cls_id AND d.cls_no = c.cls_no
      AND a.begin_time + (a.duration * 60 * 1000) > unix_timestamp() * 1000
      AND a.cos_id = e.cos_id
      AND d.std_id = 1;

SELECT
  a.*,
  b.cos_name,
  b.cos_credit
FROM student_course a, course b
WHERE a.cos_id = b.cos_id
      AND a.std_id = 1;


SELECT
  a.*,
  c.cos_name
FROM examination a, exam_publish b, course c, class d, student e
WHERE a.exam_id = b.exam_id
      AND a.cos_id = c.cos_id
      AND b.cls_id = d.cls_id
      AND d.cls_no = e.cls_no
      AND a.begin_time + (a.duration * 60 * 1000) > unix_timestamp() * 1000
      AND e.std_id = 1
      AND a.exam_id = 2;


SELECT  a.*, group_concat(b.opt_title) as answer, c.score from question a, question_option b, paper_question c
where a.qt_id = b.qt_id
and c.qt_id = b.qt_id
and b.is_right = '1'
and c.paper_id = 1
GROUP BY a.qt_id;

SELECT *
FROM examination;

SELECT *
FROM paper;

select * from student_exam;
SELECT *
FROM student_course_exam;

DELETE  from student_course_exam where exam_id=3;
DELETE FROM student_exam where exam_id=3;
select * from student;
update student set std_passwd=md5(md5('123')) ;

#c4ca4238a0b923820dcc509a6f75849b
#28c8edde3d61a0411511d3b1866f0636

select md5(md5('1'));

select * from student_course_exam where std_id=1 and exam_id=#exam_id# and cos_id=#cos_id#
select a.*, b.score from examination a, student_exam b
where a.exam_id = b.exam_id
      and b.cos_id = 1
      and b.std_id = 1

