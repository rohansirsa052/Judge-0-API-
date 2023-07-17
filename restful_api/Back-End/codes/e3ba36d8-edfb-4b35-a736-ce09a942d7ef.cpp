#include <iostream>
using namespace std;

int main() {
    double principal = 1000; // Example principal amount
    double rate = 5.5; // Example interest rate (in percentage)
    double time = 2; // Example time period (in years)
    double interest;

    // Calculate interest
    interest = (principal * rate * time) / 100;

    // Display the result
    cout << "Simple Interest = " << interest << endl;

    return 0;
}
