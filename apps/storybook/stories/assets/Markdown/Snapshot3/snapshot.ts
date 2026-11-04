export default `__Changelog - 4/11/2026__ - Subscribe to the [forum thread](https://anilist.co/forum/thread/3878) for automatic notifications.

- Spoiler tags have been reworked. The following should be viewed on our official website rather than in third-party apps:
  - Added inline spoilers, such as ~! this one !~
    - Syntax: <code>~&excl; Spoiler Text &excl;~</code> on the same line as other text
  - Added spoiler labels, such as ~!{This Label} Your Text Here !~
    - Syntax: <code>~&excl;{Label} Spoiler Text &excl;~</code>
    - May be used for more descriptive spoilers such as ~!{Ending Spoiler} Little Bobby Dies !~ or ~!{Ecchi Image} Not in the changelog !~
  - Overhauled the look of block spoilers so it's clearer where they start and end.
  - New paragraphs no longer break spoiler tags.
  - Added support for full Markdown syntax in spoiler text:<br>~!
# Your Text here

__This__ is a _demonstration_ of <u>Markdown styling</u> in ~!{Spoilers} __<u>spoiler tags</u>__ !~

> 1. Really cool list item
> 2. Another one

https://anilist.co/anime/440/%E5%B0%91%E5%A5%B3%E9%9D%A9%E5%91%BD%E3%82%A6%E3%83%86%E3%83%8A/
!~
- Fixed a long-standing issue with media subpages (e.g., characters) not appearing or them displaying the data of unrelated media.
- The activity history grid should now handle timezones and daylight saving time correctly.
- The data moderation team may now put restrictions on the maximum number of submissions per user if deemed necessary to handle the submission backlog.
- Removed MyAniList and AniTrack from our [third-party apps list](https://anilist.co/apps). MyAniList is known to overwrite people's list updates and hasn't addressed these concerns for well over a year, while AniTrack appears to have been abandoned. We advise users to either use our official website or switch to different third-party apps.
- Resolved media revision histories not loading for certain entries.
- Fixed donator badges not displaying in media activity feeds.
- Optimized the performance and accessibility of our website.
- Addressed performance issues with the deletion of API clients.

Known issues:
- iOS automatically zooms into input fields. A fix is pending internal review.

Implementation notes for developers of third-party clients:
~!
- In addition to the old \`<div rel="spoiler">\`, you should also support \`<span class="markdown-spoiler" data-label="Spoiler Label">\` for inline spoilers and \`<div class="markdown-spoiler" data-label="Spoiler Label">\` for spoiler blocks.
- Spoiler openings should pair with their closest possible closing tag.
- Inline spoilers are spoilers that appear on the same line as other text and do not contain newlines.
- Spoilers can optionally contain a label, as specified above. Empty labels should be rendered as if there wasn't a label. Labels may not contain curly braces, angle brackets, or line breaks. Whitespace around labels should be trimmed.
- Spoiler contents are rendered with full Markdown support. Spoilers within spoilers may only be three levels deep; further ones are rendered as plain text.
!~`
