import { TestBed, inject } from '@angular/core/testing';

import { Annotation } from './annotation';
import { AnnotationExporterService } from './annotation-exporter.service';

import * as _ from 'lodash';

describe('AnnotationExporterService', () => {
  function generateAnnotations(): Array<Annotation> {
    let annotations = new Array<Annotation>();
    for (let i=0; i<5; i++) {
      annotations.push(new Annotation(i.toString(), 0, 0, 'Speaker', 'caption', "unittest"))
    }
    return annotations;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnotationExporterService]
    });
  });

  it('should be created', inject([AnnotationExporterService], (service: AnnotationExporterService) => {
    expect(service).toBeTruthy();
  }));

  it('should create a valid csv download', inject([AnnotationExporterService], (service: AnnotationExporterService) => {
    const annotations = generateAnnotations();

    let urlCreateObjectSpy = spyOn(URL, 'createObjectURL').and.callFake(
      (blob) => {
        expect(blob.type).toBe("text/csv");

        let reader = new FileReader();
        reader.onload = () => {
          const csv = reader.result.split("\n");
          expect(csv[0]).toBe('"id","start","end","speaker","caption","cap_type"');

          for (const annotation in annotations) {
            expect(csv[+annotation+1]).toBe("\"" + annotations[annotation].id + "\","
              + annotations[annotation].start.toString() + ","
              + annotations[annotation].end.toString() + ","
              + "\"" + annotations[annotation].speaker + "\","
              + "\"" + annotations[annotation].caption + "\","
              + "\"" + annotations[annotation].cap_type + "\""
            );
          }
        }
        reader.readAsText(blob);
      }
    );

    // TODO filename?
    
    let a = service.asCSV("test.csv", annotations);
  }));

  it('should create a valid json download', inject([AnnotationExporterService], (service: AnnotationExporterService) => {
    const annotations = generateAnnotations();

    let urlCreateObjectSpy = spyOn(URL, 'createObjectURL').and.callFake(
      (blob) => {
        expect(blob.type).toBe("application/json");

        let reader = new FileReader();
        reader.onload = () => {
          const json = JSON.parse(reader.result);
          const expAnnotations = json.annotations;

          // This is done because lodash will fail the isEqual check
          //  as `annotations` is Array<Annotations> but expAnnotations
          //  is a flat JSON dict
          const annotationsSimple = JSON.parse(JSON.stringify(annotations));

          expect(_.isEqual(expAnnotations, annotationsSimple)).toBe(true);
        }
        reader.readAsText(blob);
      }
    );

    // TODO filename?
    
    let a = service.asJSON("test.json", annotations);
  }));

});
