import React from 'react';

export default class ReferralForm extends React.Component {

  render() {
    return (
      <div className='app container'>
     	  <h3>Refer to another Wedding Photographer</h3>
        <form>
          <div className="form-group">
            <label for="referring-photog">Referring photographer</label>
            <select className="form-control" id="referring-photog">
                <option>Shlomi Amiga</option>
                <option>Scarlet O&#39;Neill</option>
                <option>Annuj Yoganathan</option>
                <option>Erika Hammer</option>
            </select>
          </div>
          <div className="form-group">
              <label for="client-first-name">Client first name:</label>
              <input type="text" className="form-control" id="client-first-name"/>
          </div>
          <div className="form-group">
              <label for="client-last-name">Client last name:</label>
              <input type="text" className="form-control" id="client-last-name"/>
          </div>
          <div className="form-group">
              <label for="wedding-date">Wedding date (including year):</label>
              <input type="text" className="form-control" id="wedding-date"/>
          </div>
          <div className="form-group">
              <label for="wedding-city">Wedding city</label>
              <input type="text" className="form-control" id="wedding-city"/>
          </div>
          <div className="form-group">
              <label for="wedding-venue">Wedding venue</label>
              <input type="text" className="form-control" id="wedding-venue"/>
          </div>
          <div className="form-group">
              <label for="additional-notes">Additional notes</label>
              <textarea id="additional-notes" name="message" rows="10" cols="30" className="form-control"></textarea>
          </div>
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}