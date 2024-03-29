import Subjects from '../models/subjectModel'
import Users from '../models/userModel'
import TaEnrollment from '../models/taEnrollmentModel'
import dayjs from 'dayjs';

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 4
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
}

const taEnrollmentCtrl = {
    createTaSchedule: async (req, res) => {
        try {
            const { subject, requirement, dateCloseForm, description } = req.body
            console.log(description)
            const newTaSchedules = new TaEnrollment({
                subject, requirement, description, creator: req.user._id, dateCloseForm, expireAt: dateCloseForm
            })
            await newTaSchedules.save()
      /*       console.log(newTaSchedules) */
            let end = dayjs(dateCloseForm).valueOf()
            let start = dayjs(newTaSchedules.createdAt).valueOf()


            let expire = end - start
            console.log(expire)
            const NewTaSchedules = await TaEnrollment.findByIdAndUpdate(
                newTaSchedules._id,
                { $set: { link: `/registerTA/${newTaSchedules._id}`/* ,expireAt:expire */ } },
                { new: true }
            );
            /*   newTaSchedules.index({expireAt: 1},{expireAfterSeconds: expire}); */
            /*  "expireAt": { type: Date,  expires: 11 } */
            res.json({
                msg: 'Created TASchedule!',
                NewTaSchedules
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    applyTaSchedule: async (req, res) => {
        try {

            const { fullName, studentId, gpaTotal, gpaSubject, creator, link, requirement, subject, description,expireAt } = req.body



            const newTaSchedules = new TaEnrollment({
                link, subject, requirement, creator, fullName, studentId, gpaTotal, gpaSubject, candidate: req.user._id, fill: true, description,expireAt
            })

            await newTaSchedules.save()
            res.json({
                msg: "Apply success",
                newTaSchedules
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    editEnrollment: async (req, res) => {
        try {

            const { fullName, studentId, gpaTotal, gpaSubject,id } = req.body

           const newtaerollment= await TaEnrollment.findOneAndUpdate({ _id: id }, {
            fullName,gpaTotal,gpaSubject,studentId
            }, { new: true })

            /* const newTaSchedules = new TaEnrollment({
                link, subject, requirement, creator, fullName, studentId, gpaTotal, gpaSubject, candidate: req.user._id, fill: true, description
            }) */

         
            res.json({
                msg: "Edit success",
              
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getTaSchedules: async (req, res) => {
        try {

            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4;
            const page = req.query.page ? parseInt(req.query.page) : 0;
            const { keyword, sortBy, fullName, studentId, state } = req.query;

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
            if (state) {
                query.state = state;
            }

            const taSchedules = await TaEnrollment.find({ $and: [query, keywordCondition] })
                .limit(pageSize)
                .skip(pageSize * page)
                .sort(`${sortBy}`)
                .populate("candidate subject creator")
            var length = await TaEnrollment.find({ $and: [query, keywordCondition] }).count();
            if (taSchedules)

                res.status(200).json({
                    status: 'success',
                    length,
                    taSchedules

                })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getManageTaSchedules: async (req, res) => {
        try {

            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4;
            const page = req.query.page ? parseInt(req.query.page) : 0;
            const { keyword, sortBy, fullName, studentId, state } = req.query;

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
            if (state) {
                query.state = state;
            }

            const taSchedules = await TaEnrollment.find({ $and: [query, keywordCondition, { creator: req.params.id }] })
                .limit(pageSize)
                .skip(pageSize * page)
                .sort(`${sortBy}`)
                .populate("candidate subject creator")
            var length = await TaEnrollment.find({ $and: [query, keywordCondition, { creator: req.params.id }] }).count();
            if (taSchedules)

                res.status(200).json({
                    status: 'success',
                    length,
                    taSchedules

                })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getTaSchedule: async (req, res) => {
        try {
            const user = await TaEnrollment.find({ candidate: req.user._id })
            const creator = await TaEnrollment.find({ creator  : req.user._id })
        /*     console.log(user)
            console.log(creator) */
            if (user.length!==0&&creator.length==0) {
                return res.status(200).json(
                    {
                        "edit": true
                    }
                )
            }
            else if(creator){

                const newTaSchedule = await TaEnrollment.find({ _id: req.params.id }).populate('subject creator')
    
    
                return res.status(200).json(
                    newTaSchedule
                )
            }
            const newTaSchedule = await TaEnrollment.find({ _id: req.params.id }).populate('subject creator')


            return res.status(200).json(
                newTaSchedule
            )
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getTaEnrollmentEdit: async (req, res) => {
        try {

            console.log(req.user._id)
            console.log(req.params.id)
            const newTaSchedule = await TaEnrollment.find({
                $and: [
                    { link: `/registerTA/${req.params.id}` },
                    { candidate: req.user._id }
                ]
            }
            ).populate('subject creator')
           

            return res.status(200).json(
                newTaSchedule,
            )
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteTaSchedule: async (req, res) => {
        try {


            const newTaSchedule = await TaEnrollment.findOneAndDelete({ _id: req.params.id })
            res.status(200).json({
                msg: 'Deleted success!',
            }
            )
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },





}

export default taEnrollmentCtrl