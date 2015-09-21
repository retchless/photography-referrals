import React from 'react';

export default class ReferralForm extends React.Component {

  render() {
    return (
      <div className='app'>
     	  <h3>Refer to another Wedding Photographer</h3>
        <form>
          <table>
            <tr>
             <td>Referring photographer</td>
             <td>
              <select>
                <option>Shlomi Amiga</option>
                <option>Scarlet O'Neill</option>
                <option>Annuj Yoganathan</option>
                <option>Erika Hammer</option>
              </select>
             </td>
            </tr>
            <tr>
              <td>Client first name:</td>
              <td><input type="text"/></td>
            </tr>
            <tr>
              <td>Client last name:</td>
              <td><input type="text"/></td>
            </tr>
            <tr>
              <td>Wedding date (including year):</td>
              <td><input type="text"/></td>
            </tr>
            <tr>
              <td>Wedding city</td>
              <td><input type="text"/></td>
            </tr>
            <tr>
              <td>Wedding venue</td>
              <td><input type="text"/></td>
            </tr>
            <tr>
              <td>Additional notes</td>
              <td><textarea name="message" rows="10" cols="30"></textarea></td>
            </tr>
            <tr>
              <td></td>
              <td><button>Submit</button></td>
            </tr>
          </table>
        </form>
      </div>
    );
  }
}