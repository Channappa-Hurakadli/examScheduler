import React, { createContext, useContext, useReducer } from 'react';
import { processTimetable } from '../utils/timetableLogic';
import { processSeating, processInvigilators } from '../utils/seatingLogic';

// Define the shape of our state
interface TimetableSettings {
  endTermMode: boolean;
  fixedBreak: boolean;
  slotsPerDay: number;
  examsPerSlot: number;
  studentsPerSlot: number;
  blacklistCourses: string[];
}

interface ExamState {
  files: {
    timetable: any[];
    seating: any[];
    invigilator: any[];
  };
  settings: {
    timetable: TimetableSettings;
  };
  isGenerating: boolean;
  timetableGenerated: boolean;
  seatingGenerated: boolean;
  timetableData: any[] | null;
  seatingData: any[] | null;
  preview: {
    type: 'timetable' | 'seating' | 'invigilator' | null;
    data: any;
    generated: boolean;
  };
}

// Define the actions that can be dispatched
type Action =
  | { type: 'ADD_FILE'; payload: { file: File; module: 'timetable' | 'seating' | 'invigilator'; dataType: string } }
  | { type: 'UPDATE_TIMETABLE_SETTINGS'; payload: TimetableSettings }
  | { type: 'GENERATE_OUTPUT'; payload: { module: 'timetable' | 'seating' | 'invigilator' } }
  | { type: 'GENERATION_COMPLETE'; payload: { data: any; module: 'timetable' | 'seating' | 'invigilator' } };

// Create the initial state
const initialState: ExamState = {
  files: {
    timetable: [],
    seating: [],
    invigilator: [],
  },
  settings: {
    timetable: {
      endTermMode: false,
      fixedBreak: false,
      slotsPerDay: 2,
      examsPerSlot: 2,
      studentsPerSlot: 8000,
      blacklistCourses: [],
    },
  },
  isGenerating: false,
  timetableGenerated: false,
  seatingGenerated: false,
  timetableData: null,
  seatingData: null,
  preview: {
    type: null,
    data: null,
    generated: false,
  },
};

// Create the reducer function
const examReducer = (state: ExamState, action: Action): ExamState => {
  switch (action.type) {
    case 'ADD_FILE':
      return {
        ...state,
        files: {
          ...state.files,
          [action.payload.module]: [...state.files[action.payload.module], {
            id: Date.now(),
            name: action.payload.file.name,
            size: action.payload.file.size,
            dataType: action.payload.dataType,
            file: action.payload.file
          }],
        },
      };
    case 'UPDATE_TIMETABLE_SETTINGS':
        return {
            ...state,
            settings: {
                ...state.settings,
                timetable: action.payload,
            },
        };
    case 'GENERATE_OUTPUT':
      return { ...state, isGenerating: true };
    case 'GENERATION_COMPLETE':
      const data = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
      return {
        ...state,
        isGenerating: false,
        timetableGenerated: action.payload.module === 'timetable' ? true : state.timetableGenerated,
        seatingGenerated: action.payload.module === 'seating' ? true : state.seatingGenerated,
        timetableData: action.payload.module === 'timetable' ? data : state.timetableData,
        seatingData: action.payload.module === 'seating' ? data : state.seatingData,
        preview: {
          type: action.payload.module,
          data: data,
          generated: true,
        },
      };
    default:
      return state;
  }
};

const ExamContext = createContext<{
  state: ExamState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const ExamProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);
  return (<ExamContext.Provider value={{ state, dispatch }}>{children}</ExamContext.Provider>);
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within an ExamProvider');
  const { state, dispatch } = context;

  const addFile = (file: File, module: 'timetable' | 'seating' | 'invigilator', dataType: string) => {
    dispatch({ type: 'ADD_FILE', payload: { file, module, dataType } });
  };

  const updateTimetableSettings = (settings: TimetableSettings) => {
      dispatch({ type: 'UPDATE_TIMETABLE_SETTINGS', payload: settings });
  };

  const generateOutput = async (module: 'timetable' | 'seating' | 'invigilator') => {
    dispatch({ type: 'GENERATE_OUTPUT', payload: { module } });

    try {
      if (module === 'timetable') {
        const studentRegFile = state.files.timetable.find(f => f.dataType === 'studentRegistration')?.file;
        const courseDataFile = state.files.timetable.find(f => f.dataType === 'courseData')?.file;
        if (studentRegFile && courseDataFile) {
          const timetableData = await processTimetable(studentRegFile, courseDataFile, state.settings.timetable);
          dispatch({ type: 'GENERATION_COMPLETE', payload: { data: timetableData, module } });
        }
      } else if (module === 'seating') {
        const roomsFile = state.files.seating.find(f => f.dataType === 'roomData')?.file;
        const studentRegFile = state.files.timetable.find(f => f.dataType === 'studentRegistration')?.file;
        if (roomsFile && studentRegFile && state.timetableData) {
          const seatingData = await processSeating(roomsFile, studentRegFile, state.timetableData);
          dispatch({ type: 'GENERATION_COMPLETE', payload: { data: seatingData, module } });
        }
      } else if (module === 'invigilator') {
        const invigilatorsFile = state.files.invigilator.find(f => f.dataType === 'invigilatorData')?.file;
        if (invigilatorsFile && state.seatingData) {
          const invigilatorData = await processInvigilators(invigilatorsFile, state.seatingData);
          dispatch({ type: 'GENERATION_COMPLETE', payload: { data: invigilatorData, module } });
        }
      }
    } catch (error) {
      console.error(`Error processing ${module}:`, error);
    }
  };

  return { state, addFile, generateOutput, updateTimetableSettings };
};
