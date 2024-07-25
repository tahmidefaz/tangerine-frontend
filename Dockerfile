# First stage builds the application
FROM registry.access.redhat.com/ubi9/nodejs-18 as builder

# Add application sources
ADD . $HOME

# In case you run into permission errors during build (eg. by use of umask)
# running the fix-permission script will make sure all bits are as expected by the image
USER 0
RUN fix-permissions ./
USER 1001

# Install the dependencies
RUN npm install

# Second stage copies the application to the minimal image
FROM registry.access.redhat.com/ubi9/nodejs-18-minimal

# Copy the application source and build artifacts from the builder image to this one
COPY --from=builder $HOME $HOME

# Run script uses standard ways to run the application
CMD npm run -d start
