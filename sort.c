#include <stdio.h>
#include <stdlib.h>

void sort(int size, int* list) {
  if (size == 1) return;

  for (int i = 0; i < size; i++) {
    if (list[i] > list[i+1]) {
      int hold = list[i+1];
      list[i+1] = list[i];
      list[i] = hold;
    }
  }

  sort(size - 1, list);
}

int main (int argc, char** argv) {
  int numVals = argc - 1;
  int* numbers = malloc(sizeof(int) * argc - 1);
  int i = 0;

  for (i = 1; i < argc; i++) {
    numbers[i - 1] = atoi(argv[i]);
  }

  sort(numVals, numbers);

  for (i = 0; i < numVals; i++) {
    printf("%d ", numbers[i]);
  }

  free(numbers);

  return 0;
}

