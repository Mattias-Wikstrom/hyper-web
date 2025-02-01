import { HyperStateCore, HyperExportFormatVersion1, HyperPointElementVersion1, ImportAndExport } from './ImportAndExport'; 
//import { SpaceElement } from './SpaceElement';
import { Point } from './Point';
import { Length } from './Length';
import { Angle } from './Angle';

describe('ImportAndExport Class', () => {
    let state1 : HyperStateCore;
    let dataToImport : HyperExportFormatVersion1;
    
    beforeAll(() => {
        state1 =
            {
                curvature: 3.0,
                invCurvature: 1 / 3.0,
                elements: [
                    new Point(new Length(4), new Angle(.5)),
                    new Point(new Length(4.4), new Angle(1.5)),
                ]
            };

        dataToImport = {
            fileType: 'Hyper',
            version: 1,
            curvature: -2.0,
            elements: [
                {type: 'point', d: 5.6, a: -1.1} as HyperPointElementVersion1
            ]
        } as HyperExportFormatVersion1;
    });
    
    describe('import_from_object function', () => {
        it('should set correct curvature for import_from_object', () => {
            let test_state : HyperStateCore = {} as HyperStateCore;

            ImportAndExport.import_from_object(test_state, dataToImport);
            expect(test_state.curvature).toBe(-2); 
        });

        it('should set correct inverted curvature for import_from_object', () => {
            let test_state : HyperStateCore = {} as HyperStateCore;

            ImportAndExport.import_from_object(test_state, dataToImport);
            expect(test_state.invCurvature).toBe(1 / -2.0); 
        });
        
        it('should check fileType for import_from_object', () => {
            let test_state : HyperStateCore = {} as HyperStateCore;

            let _dataToImport = {
                curvature: -2.0
                // No fileType specified
            } as HyperExportFormatVersion1;

            expect(() => ImportAndExport.import_from_object(test_state, _dataToImport)).toThrow(); 
        });
        
        it('should check version for import_from_object', () => {
            let test_state : HyperStateCore = {} as HyperStateCore;

            let _dataToImport = {
                curvature: -2.0,
                fileType: 'Hyper',
                version: 50
            } as HyperExportFormatVersion1;

            expect(() => ImportAndExport.import_from_object(test_state, _dataToImport)).toThrow(); 
        });
        
        it('should set expected number of elements for import_from_object', () => {
            let test_state : HyperStateCore = {} as HyperStateCore;

            ImportAndExport.import_from_object(test_state, dataToImport);
            expect(test_state.elements).toHaveLength(1);
        });
    });

    describe('export_to_object function', () => {
        it('should return correct fileType for export_to_object', () => {
            expect(ImportAndExport.export_to_object(state1).fileType).toBe('Hyper'); 
        });

        it('should return correct curvature for export_to_object', () => {
            expect(ImportAndExport.export_to_object(state1).curvature).toBe(3.0); 
        });
        
        it('should return correct number of elements for export_to_object', () => {
            expect(ImportAndExport.export_to_object(state1).elements).toHaveLength(2); 
        });

        it('should return a version number for export_to_object', () => {
            expect(ImportAndExport.export_to_object(state1).version).toBeGreaterThanOrEqual(1); 
        });
    });
});