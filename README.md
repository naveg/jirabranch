# JIRABranch - Easily generate branch names in JIRA

JIRABranch is a chrome extension that generates branch names for JIRA tickets.

A branch icon is added next to JIRA issue keys:

![Screenshot 2022-12-28 at 6 23 36 PM](https://user-images.githubusercontent.com/187232/210027655-1eed5b79-3619-446e-bc31-75340aab63ba.png)

Click the icon and a branch name will be copied to your clipboard.

An arbitrary prefix can be added in the extension's options. You can set this to something like `username/` or `git checkout -b ` depending on your typical git workflow.

Developing
----------

Follow these steps if you are tweaking the shortify code and want to quickly see
your changes reflected in the browser:

 * Clone this repository.
 * Go to Chrome's Extensions area and make sure "Developer Mode" is checked.
 * Click the "Load unpacked extension..." button and then choose this repo's
   folder.
 * Click the "Options" link to configure the extension.

