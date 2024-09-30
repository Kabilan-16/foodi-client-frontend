import React from 'react';
import './Contact.css';


const ContactUs = () => {
  const employees = [
    {
      name: 'Arun Prasanth',
      role: 'Supervisor',
      phone: '+91 76545 67890',
    },
    {
      name: 'Jaya Kumar',
      role: 'Employee',
      phone: '+91 98765 43210',
    },
    {
        name: 'Vasanth',
        role: 'Employee',
        phone: '+91 98899 45670',
      },
  ];

  return (
    <div className="contact-us">
      <h1>Contact Us</h1>
      <p><strong>Foodie Restaurant</strong></p>
      <p><span className="text-green">Main Branch</span><br />Gandhi Street, KK Nagar, Erode<br />Tamil Nadu, India</p>
      <p>Email:<a href="mailto:foodirestaurant@email.com">foodirestaurant@email.com</a></p>
      <p>Ph:<a href="tel:+919582489662">+91 95824 89662</a></p>

      <h2 className="team-heading"><strong>Our Team</strong></h2>
      <div className="employee-container">
        {employees.map((employee, index) => (
          <div key={index} className={`employee-box ${employee.role.toLowerCase()}`}>
            <strong>{employee.name}</strong> <br />
            <span className="role">{employee.role}</span> <br />
            Phone:<a href={`tel:${employee.phone}`}>{employee.phone}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;
