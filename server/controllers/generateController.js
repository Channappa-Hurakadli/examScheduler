const { db } = require('../config/firebase');
const timetableService = require('../services/timetableService');
const seatingService = require('../services/seatingService');
const { parseCSV } = require('../services/parserService');

const saveToHistory = async (userId, collectionName, data) => {
    await db.collection('users').doc(userId).collection(collectionName).add({
        createdAt: new Date(),
        data: data
    });
};

const generateTimetable = async (req, res) => {
    try {
        const { settings } = req.body;
        const studentRegFile = req.files['studentRegistration'][0];
        const courseDataFile = req.files['courseData'][0];

        const studentData = parseCSV(studentRegFile.buffer.toString());
        const courseData = parseCSV(courseDataFile.buffer.toString());
        
        const timetable = timetableService.processTimetable(studentData, courseData, JSON.parse(settings));
        
        await saveToHistory(req.user.uid, 'timetables', timetable);

        res.status(200).json(timetable);
    } catch (error) {
        console.error("Timetable generation error:", error);
        res.status(500).json({ message: 'Error generating timetable', error: error.message });
    }
};

const generateSeating = async (req, res) => {
    try {
        const roomDataFile = req.files['roomData'][0];
        const { timetableData, studentData } = req.body;

        const roomData = parseCSV(roomDataFile.buffer.toString());

        const seatingPlan = seatingService.processSeating(
            JSON.parse(timetableData), 
            JSON.parse(studentData), 
            roomData
        );
        
        await saveToHistory(req.user.uid, 'seatingPlans', seatingPlan);

        res.status(200).json(seatingPlan);
    } catch (error) {
        console.error("Seating generation error:", error);
        res.status(500).json({ message: 'Error generating seating plan', error: error.message });
    }
};

const generateInvigilators = async (req, res) => {
    try {
        const invigilatorFile = req.files['invigilatorData'][0];
        const { seatingData, timetableData } = req.body;

        const invigilatorData = parseCSV(invigilatorFile.buffer.toString());

        const assignments = seatingService.processInvigilators(
            JSON.parse(seatingData), 
            invigilatorData,
            JSON.parse(timetableData)
        );

        await saveToHistory(req.user.uid, 'invigilatorAssignments', assignments);

        res.status(200).json(assignments);
    } catch (error) {
        console.error("Invigilator assignment error:", error);
        res.status(500).json({ message: 'Error generating invigilator assignments', error: error.message });
    }
};

module.exports = { generateTimetable, generateSeating, generateInvigilators };
