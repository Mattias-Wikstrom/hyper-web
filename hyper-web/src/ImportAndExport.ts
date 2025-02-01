
import { SpaceElement } from './SpaceElement';
import { Point } from './Point';
import { Length } from './Length';
import { Angle } from './Angle';

export interface HyperStateCore {
  curvature: number;
  invCurvature: number;
  elements: Array<SpaceElement>;
}

export interface HyperElementVersion1 {
    type : string;
}

export interface HyperPointElementVersion1 extends HyperElementVersion1 {
    type : "point";
    d : number;
    a : number;
}

export interface HyperExportFormatVersion1 {
    fileType : string;
    version: number;
    curvature: number;
    elements: Array<HyperElementVersion1>;
}

export type ImportErrorReason = 
    "Unexpected file type." 
    | "Unexpected version number." 
    | "This file appears to have been created with a newer version of Hyper."
    | "Invalid file format.";

export interface ImportError
{
    reason : ImportErrorReason;
}

export class ImportAndExport {
    static import_from_object(state: HyperStateCore, dataToImport: HyperExportFormatVersion1) {
        if (dataToImport.fileType != 'Hyper') {
            throw { reason: 'Unexpected file type.'} as ImportError;
        }

        if (typeof dataToImport.version !== "number") {
            throw { reason: 'Unexpected version number.'} as ImportError;
        }

        if (dataToImport.version > 1) {
            throw { reason: 'This file appears to have been created with a newer version of Hyper.'} as ImportError;
        }
        
        if (typeof dataToImport.elements !== typeof []) {
            throw { reason: 'Invalid file format.'} as ImportError;
        }

        state.curvature = dataToImport.curvature;
        state.invCurvature = 1.0 / dataToImport.curvature;
        
        let _elements : Array<SpaceElement> = [];

        for (let elem of dataToImport.elements) {
            if (typeof elem.type !== 'string') {
                throw { reason: 'Invalid file format.'} as ImportError;
            }

            if (elem.type === 'point') {
                let pt = elem as HyperPointElementVersion1;
                
                _elements.push(new Point(
                    new Length(pt.d),
                    new Angle(pt.a)
                ));
            }
        }

        state.elements = _elements;
    }

    static export_to_object(state: HyperStateCore): HyperExportFormatVersion1 {        
        let convertedElements : Array<HyperElementVersion1> = [];

        for (let elem of state.elements)
        {
            if (elem instanceof Point)
            {
                const pt = elem as Point;

                const convertedElement : HyperPointElementVersion1
                    = {
                        type: "point",
                        d: pt.d.l, 
                        a: pt.a.a
                    };

                convertedElements.push(convertedElement);
            }   
        }
        
        return {
            fileType: 'Hyper',
            version: 1,
            curvature: state.curvature,
            elements: convertedElements,
        };
    }

    static import_from_string(state: HyperStateCore, dataToImport: string) {
        ImportAndExport.import_from_object(state, JSON.parse(dataToImport) as HyperExportFormatVersion1);
    }

    static export_to_string(state: HyperStateCore): string {
        return JSON.stringify(ImportAndExport.export_to_object(state));
    }
}
