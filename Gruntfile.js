module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // 任务名称，需根据插件的说明来写
        concat: {
            // 子任务名称，这名称随你起
            pub: {
                // 可选的配置参数
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                // 源文件路径
                src: [
                    'src/main/webapp/assets/diy/**/*.js'
                ],
                // 运行任务后生成的目标文件
                dest: 'src/main/webapp/dist/pub.js'
            },
            teacher: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                src: [
                    'src/main/webapp/app/teacher/**/*.js',
                ],
                dest: 'src/main/webapp/dist/teacher.js'
            },
            student: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                src: [
                    'src/main/webapp/app/student/**/*.js',
                ],
                dest: 'src/main/webapp/dist/student.js'
            },
            teacher_resource: {
                src: [
                    'src/main/webapp/resource/teacher/**/*.js'
                ],
                dest: 'src/main/webapp/dist/teacher-resource.js'
            },
            student_resource: {
                src: [
                    'src/main/webapp/resource/student/**/*.js'
                ],
                dest: 'src/main/webapp/dist/student-resource.js'
            }
        },
        uglify: {
            prod: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - compressed JS\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n  */\n'
                },
                files: {
                    'src/main/webapp/dist/pub.min.js': ['<%= concat.pub.dest %>'],
                    'src/main/webapp/dist/teacher.min.js': ['<%= concat.teacher.dest %>'],
                    'src/main/webapp/dist/student.min.js': ['<%= concat.student.dest %>'],
                    'src/main/webapp/dist/teacher-resource.min.js': ['<%= concat.teacher_resource.dest %>'],
                    'src/main/webapp/dist/student-resource.min.js': ['<%= concat.student_resource.dest %>']
                }

            }
        }
    });

// 载入要使用的插件
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
// 注册任务
    grunt.registerTask('default', ['concat', 'uglify']);
};