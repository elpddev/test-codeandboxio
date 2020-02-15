import { of, from } from 'rxjs'; 
import { map, scan } from 'rxjs/operators';
import { expect } from 'chai';

function nonUniqueElements() {
    return (obs) => obs.pipe(
      map(arr => {
        const dictionary = arr.reduce((acc, x) => {
          acc[x] = (acc[x] || 0) + 1;
          return acc;
        }, {});
        return { arr, dictionary };
      }),
      map(({ arr, dictionary }) => {
        return arr.reduce((acc, x) => {
          if (dictionary[x] === 1) {
            return acc;
          }
          acc.push(x);
          return acc;
        }, []);
      }),
    );
}

let i = 0;
const source = from([
  [1, 2, 3, 1, 3],
  [1, 2, 3, 4, 5],
  [5, 5, 5, 5, 5],
  [10, 9, 10, 10, 9, 8]
]).pipe(
  nonUniqueElements(),
  scan(([i, a], r) => ([ i+=1, r]), [-1, 0]),
).subscribe(([i, result]) => {
  const expected = [
    [1,3,1,3],
    [],
    [5, 5, 5, 5, 5],
    [10, 9, 10, 10, 9]
  ][i];
  console.log('***', i, result, expected); 
  expect(result).to.deep.equal(expected);
});