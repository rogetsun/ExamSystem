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
                    'web/assets/diy/**/*.js'
                ],
                // 运行任务后生成的目标文件
                dest: 'web/dist/pub.js'
            },
            teacher: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                src: [
                    'web/app/teacher/**/*.js',
                ],
                dest: 'web/dist/teacher.js'
            },
            student: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                src: [
                    'web/app/student/**/*.js',
                ],
                dest: 'web/dist/student.js'
            },
            teacher_resource: {
                src: [
                    'web/resource/teacher/**/*.js'
                ],
                dest: 'web/dist/teacher-resource.js'
            },
            student_resource: {
                src: [
                    'web/resource/student/**/*.js'
                ],
                dest: 'web/dist/student-resource.js'
            }
        },
        uglify: {
            prod: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - compressed JS\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n  */\n'
                },
                files: {
                    'web/dist/pub.min.js': ['<%= concat.pub.dest %>'],
                    'web/dist/teacher.min.js': ['<%= concat.teacher.dest %>'],
                    'web/dist/student.min.js': ['<%= concat.student.dest %>'],
                    'web/dist/teacher-resource.min.js': ['<%= concat.teacher_resource.dest %>'],
                    'web/dist/student-resource.min.js': ['<%= concat.student_resource.dest %>']
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