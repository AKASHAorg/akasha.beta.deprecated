import React from 'react';


export default function EntryContent ({ content }) {
    console.log(content);
    if (!content) {
        return (
          <div>Mock content</div>
        );
    }
    return (
      <article>
        <p>
          The odorous smell of mold and mildew hits you like a brick wall when you step
          through the front doors at Spain Elementary-Middle School in Detroit.
        </p>
        <h2>Heading 2</h2>
        <p>
          I have been at Spain for 19 years, first as a first-grade teacher, then,
          after earning a master’s degree in counseling, as a school counselor. When I
          first started, it was a school any city would be proud to have in its
          district.
        </p>
      </article>
    );
}

EntryContent.propTypes = {
    content: React.PropTypes.object
};
