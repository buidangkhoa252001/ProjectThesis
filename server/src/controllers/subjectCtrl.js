
import Users from '../models/userModel'
import Subjects from '../models/subjectModel'
import TaEnrollment from '../models/taEnrollmentModel'

import { UserRole } from '../constant';
import clientRedis from '../config/connectRedis'

const subjectCtrl = {
    createSubject: async (req, res) => {
        try {
            console.log('gg')
            const { subjectName, description, teacher, subjectCode } = req.body
            const subjectExist = await Subjects.findOne({ subjectName });
            if (subjectExist) {
                /*    res.status(200).json({subjectExist}) */
                const newSubject = await Subjects.findOneAndUpdate({ _id: subjectExist._id }, {
                    $push: { teacher: teacher }
                }, { new: true })
                /*  console.log(newSubject) */
                res.status(200).json({ newSubject })
                /*   subjectExist._id */
            }
            else {

                const subject = new Subjects({
                    subjectName, description, subjectCode
                })
                await subject.save();

                const newSubject = await Subjects.findOneAndUpdate({ _id: subject._id }, {
                    $push: { teacher: teacher }
                }, { new: true })
                res.status(200).json({ newSubject })
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getSubject: async (req, res) => {
        try {

            /*   const subjects = await Subjects.find({
                  subjectName: { $regex: req.query.subject }, teacher:[{ $regex: req.query.user }]
              }) */
            const subjects = await Subjects.find({
                'teacher': {
                    $in: req.query.user
                }, 'subjectName': { $regex: req.query.subject }
            })
            /*  .limit(10) */

            res.json({ subjects });

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    approvalTA: async (req, res) => {
        try {
            const { subject, student, taSchedule, studentId } = req.body
            /* stundet doi role TA */
            /* taSchedule doi status */
            /* subject push id student */

            await TaEnrollment.findOneAndUpdate({ _id: taSchedule }, {
                state: 'approve'
            }, { new: true })
            await Users.findOneAndUpdate({ _id: student }, {
                role: UserRole.TA, subjectTa: subject, studentId: studentId
            }, { new: true })
            await Subjects.findOneAndUpdate({ _id: subject }, {
                $push: { teachingAssistant: student }
            }, { new: true })
            clientRedis.del(`ta`)

            res.status(200).json({ msg: 'success approve' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    rejectTA: async (req, res) => {
        try {
            const { subject, student, taSchedule, studentId } = req.body
          
            
            await TaEnrollment.findOneAndUpdate({ _id: taSchedule }, {
                state: 'reject'
            }, { new: true })
          
            clientRedis.del(`ta`)

            res.status(200).json({ msg: 'success reject' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllSubject: async (req, res) => {
        try {
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4;
            const page = req.query.page ? parseInt(req.query.page) : 0;
            const { keyword, sortBy, subjectName, teacher } = req.query;

            var query = {};
            var keywordCondition = keyword
                ? {
                    $or: [
                        { subjectName: { $regex: keyword, $options: "i" } },
                        { teacher: { $regex: keyword, $options: "i" } },
                    ],
                }
                : {};
            if (subjectName) {
                query.subjectName = subjectName;
            }
            if (teacher) {
                query.teacher = teacher;
            }

            const subjects = await Subjects.find({ $and: [query, keywordCondition] })
                .limit(pageSize)
                .skip(pageSize * page)
                .sort(`${sortBy}`)
                .populate("teacher teachingAssistant")

            var length = await Subjects.find({ $and: [query, keywordCondition] }).count();
            res.status(200).json({
                status: 'success',
                length,
                subjects
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getTeacherTa: async (req, res) => {
        try {
            console.log('getTA')
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4;
            const page = req.query.page ? parseInt(req.query.page) : 0;
            const { keyword, sortBy, fullName, studentId } = req.query;

            var query = {};
            var keywordCondition = keyword
                ? {
                    $or: [
                        { fullName: { $regex: keyword, $options: "i" } },
                        { studentId: { $regex: keyword, $options: "i" } },
                    ],
                }
                : {};
            if (fullName) {
                query.fullName = fullName;
            }
            if (studentId) {
                query.studentId = studentId;
            }

            const subject = await Subjects.find({ $and: [query, keywordCondition, { teacher: req.params.id }] })
                .populate("teacher teachingAssistant")
            if(!subject){
                res.status(200).json({
                    status: 'success',
                    length: 0,
                    taSchedules:{},
                  
                })
            }
          const newArray = subject.map(obj => obj._id);

    
            const taSchedules = await Users.find({ $and: [query, keywordCondition, { role: 'ta', subjectTa: { $in: newArray }}] })
                .limit(pageSize)
                .skip(pageSize * page)
                .sort(`${sortBy}`)
                .select("-password")
                .populate("subjectTa profile")

            var length = await Users.find({ $and: [query, keywordCondition, { role: 'ta', subjectTa: { $in: newArray }}] }).count();
            res.status(200).json({
                status: 'success',
                length: length,
                taSchedules,
                newArray
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllTa: async (req, res) => {

        try {

            clientRedis.get(`ta`, async (err, cachedta) => {
                if (err) throw err;

                if (cachedta) {
                    res.json(JSON.parse(cachedta));
                } else {

                    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4;
                    const page = req.query.page ? parseInt(req.query.page) : 0;
                    const { keyword, sortBy, fullName, studentId } = req.query;

                    var query = {};
                    var keywordCondition = keyword
                        ? {
                            $or: [
                                { fullName: { $regex: keyword, $options: "i" } },
                                { studentId: { $regex: keyword, $options: "i" } },
                            ],
                        }
                        : {};
                    if (fullName) {
                        query.fullName = fullName;
                    }
                    if (studentId) {
                        query.studentId = studentId;
                    }
                    const taSchedules = await Users.find({ $and: [query, keywordCondition, { role: 'ta' }] })
                        .limit(pageSize)
                        .skip(pageSize * page)
                        .sort(`${sortBy}`)
                        .select("-password")
                        .populate("subjectTa profile")

                    var length = await Users.find({ $and: [query, keywordCondition, { role: 'ta' }] }).count();
                    clientRedis.setex(`ta`, 60, JSON.stringify({
                        status: 'success',
                        length,
                        taSchedules
                    }));


                    res.status(200).json({
                        status: 'success',
                        length,
                        taSchedules
                    })


                }
            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateSubject: async (req, res) => {
        try {
            console.log('app')
            const { subjectName, description, teacher, id, subjectCode } = req.body


            await Subjects.findOneAndUpdate({ _id: id }, {
                subjectName, description, teacher, subjectCode
            }, { new: true })

            res.json({ msg: "Update Success!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteSubject: async (req, res) => {
        try {

            await Subjects.findOneAndDelete({ _id: req.params.id })
            res.status(200).json({
                msg: 'Deleted success!',
            }
            )
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}

export default subjectCtrl