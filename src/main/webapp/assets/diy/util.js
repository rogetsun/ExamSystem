/**
 * Created by uv2sun on 15/12/24.
 */
String.prototype.replaceAll = function (AFindText, ARepText) {
    return this.replace(new RegExp(AFindText, "gm"), ARepText)
};