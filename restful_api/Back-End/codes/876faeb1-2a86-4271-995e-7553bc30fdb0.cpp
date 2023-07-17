#include <iostream>
using namespace std;

int main() {
  float principal = 1000; // Predefined principal amount
  float rate = 5; // Predefined interest rate
  float time = 2; // Predefined time period in years

  float interest = (principal * rate * time) / 100;

  cout << "Simple Interest = " << interest << endl;

  return 0;
}
